import { useEffect, useRef, useState } from "react";
import { PackageIcon, NavigationIcon } from "lucide-react";
import OtpModal from "../../components/Delivery/OtpModal";
import CancelModal from "../../components/Delivery/CancelModal";
import DeliveryOrderCard from "../../components/Delivery/DeliveryOrderCard";
import Loading from "../../components/Loading";
import type { Order } from "../../types";
import api from "../../lib/api";
import toast from "react-hot-toast";


const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("delivery_token")}` }
})

const getApiErrorMessage = (error: any, fallback: string) => {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message === "Network Error") {
        return "Cannot reach the backend server. Check that it is running on http://localhost:5000";
    }
    return error?.message || fallback;
}

export default function DeliveryDashboard() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"active" | "completed">("active");
    const [tracking, setTracking] = useState(false);

    // OTP modal
    const [otpModal, setOtpModal] = useState<string | null>(null);
    const [otp, setOtp] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Cancel modal
    const [cancelModal, setCancelModal] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const watchIdRef = useRef<number | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/delivery/my-deliveries?status=${tab}`, getAuthHeaders());

            setOrders(data?.orders || []);
        } catch (error: any) {

            toast.error(getApiErrorMessage(error, "Failed to load deliveries"));
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchOrders();
    }, [tab]);

    // Send location every 10s for active deliveries.
    useEffect(() => {
        const activeOrders = orders.filter((o) =>
            ["Assigned", "Packed", "Out for Delivery"].includes(o.status));

        if (activeOrders.length === 0 || !tracking) {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            return;
        }

        if (!navigator.geolocation) {
            toast.error("Location sharing is not supported by this browser");
            setTracking(false);
            return;
        }

        const sendLocation = (pos: GeolocationPosition) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            activeOrders.forEach((order) => {
                api.put(`/delivery/my-deliveries/${order.id}/location`, { lat, lng }, getAuthHeaders())
                    .catch(() => undefined);
            });
        }

        watchIdRef.current = navigator.geolocation.watchPosition(sendLocation, () => {
            toast.error("Unable to share your location");
            setTracking(false);
        }, {
            enableHighAccuracy: true,
            maximumAge: 10000,
        })

        // Also send on interval for more consistent updates
        const interval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(sendLocation,
                () => { }, { enableHighAccuracy: true })
        }, 10000)

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
                watchIdRef.current = null;
            }
            clearInterval(interval)
        }

    }, [orders, tracking])

    const handleUpdateStatus = async (orderId: string, status: string) => {
        setSubmitting(true);
        try {
            await api.put(`/delivery/my-deliveries/${orderId}/status`, { status }, getAuthHeaders());
            toast.success(`Delivery marked ${status.toLowerCase()}`);
            await fetchOrders();
        } catch (error: any) {
            toast.error(getApiErrorMessage(error, "Failed to update delivery status"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleComplete = async () => {
        if (!otpModal || !otp) return;
        setSubmitting(true);
        try {
            await api.put(`/delivery/my-deliveries/${otpModal}/complete`, { otp }, getAuthHeaders());
            toast.success("Delivery completed");
            setOtpModal(null);
            setOtp("");
            await fetchOrders();
        } catch (error: any) {
            toast.error(getApiErrorMessage(error, "Failed to complete delivery"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelModal) return;
        setSubmitting(true);
        try {
            await api.put(`/delivery/my-deliveries/${cancelModal}/cancel`, { reason: cancelReason }, getAuthHeaders());
            toast.success("Delivery cancelled");
            setCancelModal(null);
            setCancelReason("");
            await fetchOrders();
        } catch (error: any) {
            toast.error(getApiErrorMessage(error, "Failed to cancel delivery"));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Tabs + Tracking toggle */}
            <div className="flex items-center gap-2 flex-wrap">
                {(["active", "completed"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${tab === t ? "bg-app-green text-white" : "bg-white text-zinc-600 hover:bg-app-cream border border-app-border"}`}>
                        {t === "active" ? "Active" : "Completed"}
                    </button>
                ))}
                <div className="ml-auto">
                    <button onClick={() => setTracking((prev) => !prev)} className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${tracking ? "bg-green-600 text-white" : "bg-white text-zinc-600 border border-app-border hover:bg-app-cream"}`}>
                        <NavigationIcon className={`w-3.5 h-3.5 ${tracking ? "animate-pulse" : ""}`} />
                        {tracking ? "Sharing Location" : "Share Location"}
                    </button>
                </div>
            </div>

            {/* Orders */}
            {loading ? (
                <Loading />
            ) : (orders?.length ?? 0) === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-app-border">
                    <PackageIcon className="size-12 text-app-border mx-auto mb-3" />
                    <p className="text-lg font-semibold text-zinc-900 mb-1">No {tab} deliveries</p>
                    <p className="text-sm text-zinc-500">{tab === "active" ? "You'll see new assignments here" : "Completed deliveries will appear here"}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => <DeliveryOrderCard key={order.id} order={order} tab={tab} handleUpdateStatus={handleUpdateStatus} setOtpModal={setOtpModal} setCancelModal={setCancelModal} />)}
                </div>
            )}

            {/* OTP Modal */}
            {otpModal && <OtpModal setOtpModal={setOtpModal} otp={otp} setOtp={setOtp} handleComplete={handleComplete} submitting={submitting} />}
            {/* Cancel Modal */}
            {cancelModal && <CancelModal setCancelModal={setCancelModal} cancelReason={cancelReason} setCancelReason={setCancelReason} handleCancel={handleCancel} submitting={submitting} />}
        </div>
    );
}
