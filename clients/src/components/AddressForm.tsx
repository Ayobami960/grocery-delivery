import { XIcon, Loader2 } from "lucide-react";

const AddressForm = ({ resetForm, handleSubmit, form, setForm, editingId, isSubmitting }: any) => {
    
    return (
        <>
            {/* overlay */}
            <div className="fixed inset-0 bg-black/40 z-50" />

            {/* form container */}
            <div onClick={resetForm} className="fixed inset-0 z-50 flex-center p-4">
                <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit}
                    className="bg-white rounded-2xl p-6 w-full
        max-w-lg animate-fade-in">
                    {/* form header */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-l font-semibold text-app-green">
                            {editingId ? "Edit Address" : "Add New Address"}
                        </h2>
                        <button type="button" onClick={resetForm}
                            className="p-2 hover:bg-app-cream rounded-lg">
                            <XIcon className="size-5" />
                        </button>
                    </div>

                    {/* form input fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-app-green
                    mb-1.5">Information about  your address in full details</label>
                            <input type="text" required
                                placeholder="Home, Work, etc."
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border
                     focus:border-app-green outline-none"
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-app-green
                    mb-1.5">Street Address</label>
                            <input type="text" required
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border
                     focus:border-app-green outline-none"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                            />
                        </div>


                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-app-green
                    mb-1.5">City</label>
                                <input type="text"
                                    required
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border
                     focus:border-app-green outline-none"
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-app-green
                    mb-1.5">State</label>
                                <input type="text" required
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border
                     focus:border-app-green outline-none"
                                    value={form.state}
                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                />
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-app-green
                    mb-1.5">Zip Code</label>
                                <input type="text"
                                    required
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border
                     focus:border-app-green outline-none"
                                    value={form.zip}
                                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                                />
                            </div>

                            <div className="flex items-end pb-1">
                                <label className="block text-sm font-medium
                                 text-app-green mb-1.5">
                                    <input type="checkbox" checked={form.isDefault}
                                    onChange={(e) => setForm({...form, isDefault: e.target.checked})}
                                    />
                                    <span
                                    className="text-sm text-app-text"
                                    >Set as default</span>
                                </label>

                            </div>

                        </div>
                    </div>


                   <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 w-full py-3 bg-app-green text-white font-semibold rounded-xl 
                        hover:bg-app-green-light transition-colors flex items-center justify-center gap-2 
                        disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                {editingId ? "Updating Address..." : "Saving Address..."}
                            </>
                        ) : (
                            editingId ? "Update Address" : "Save Address"
                        )}
                    </button>
                </form>
            </div>
        </>
    )
}

export default AddressForm