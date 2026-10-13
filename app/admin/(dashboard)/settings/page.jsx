"use client";

import { useEffect, useRef, useState } from "react";

import {
    Bell,
    Building2,
    Check,
    ChevronDown,
    Globe2,
    ImagePlus,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    ReceiptText,
    RotateCcw,
    Save,
    Settings,
    ShieldCheck,
    Upload,
    X,
} from "lucide-react";

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const defaultSettings = {
    companyName: "Top Range Building Materials",
    // email: "info@toprange.ae",
    // phone: "+971 00 000 0000",
    // whatsapp: "+971 50 123 4567",
    address: "Ajman, United Arab Emirates",

    websiteName: "Easy Purchase",
    websiteUrl: "",
    currency: "AED",

    quotationPrefix: "QT",
    quotationValidity: "30",
    vatRate: "5",

    emailNotifications: true,
    quotationNotifications: true,
    customerNotifications: true,

    maintenanceMode: false,
    showWhatsApp: true,
};

/* =========================================================
   PAGE
========================================================= */

export default function SettingsPage() {
    const fileInputRef = useRef(null);

    const [settings, setSettings] = useState(defaultSettings);

    const [logo, setLogo] = useState("");
    const [logoFile, setLogoFile] = useState(null);

    const [currencyOpen, setCurrencyOpen] = useState(false);

    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [saveError, setSaveError] = useState("");

    useEffect(() => {
        let active = true;

        const loadSettings = async () => {
            try {
                const response = await fetch("/api/settings", {
                    method: "GET",
                    cache: "no-store",
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Unable to load settings.");
                }
                if (!active) return;
                setSettings((previous) => ({ ...previous, ...data.settings }));
                setLogo(data.settings?.logoUrl || "");
                setLoadError("");
            } catch (error) {
                if (active) setLoadError(error.message || "Unable to load settings.");
            }
        };

        loadSettings();
        return () => { active = false; };
    }, []);

    /* =========================================================
       UPDATE
    ========================================================= */

    const updateSetting = (event) => {
        const { name, value } = event.target;

        setSettings((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSaved(false);
    };

    /* =========================================================
       TOGGLE
    ========================================================= */

    const toggleSetting = (name) => {
        setSettings((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));

        setSaved(false);
    };

    /* =========================================================
       LOGO
    ========================================================= */

    const handleLogo = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return;
        }

        if (logo) {
            URL.revokeObjectURL(logo);
        }

        const previewUrl = URL.createObjectURL(file);

        setLogo(previewUrl);
        setLogoFile(file);
        setSaved(false);
    };

    const removeLogo = () => {
        if (logo) {
            URL.revokeObjectURL(logo);
        }

        setLogo("");
        setLogoFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /* =========================================================
       RESET
    ========================================================= */

    const resetSettings = () => {
        setSettings(defaultSettings);

        removeLogo();

        setCurrencyOpen(false);
        setSaved(false);
    };

    /* =========================================================
       SAVE
    ========================================================= */

    const saveSettings = async (event) => {
        event.preventDefault();
        setSaving(true);
        setSaved(false);
        setSaveError("");

        try {
            const formData = new FormData();
            formData.append("settings", JSON.stringify({
                ...settings,
                // Keep the existing permanent URL unless a new logo is selected.
                logoUrl: logoFile ? "" : (logo || ""),
            }));
            if (logoFile) formData.append("logo", logoFile);

            const response = await fetch("/api/settings", {
                method: "PUT",
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Unable to save settings.");
            }

            setSettings((previous) => ({ ...previous, ...data.settings }));
            setLogo(data.settings?.logoUrl || "");
            setLogoFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setSaved(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            setSaveError(error.message || "Unable to save settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            {/* =====================================================
          HEADER
      ====================================================== */}

            <div className="flex flex-col gap-6 border-b border-black/[0.08] pb-7 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#94BE26]" />

                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6D746D]">
                            Administration
                        </p>
                    </div>

                    <h1 className="mt-3 text-[36px] font-semibold leading-none tracking-[-0.045em] text-[#151814] sm:text-[42px] lg:text-[48px]">
                        Settings
                    </h1>

                    <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#686F68]">
                        Manage your company information, quotation preferences,
                        website options and administrator notifications.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={resetSettings}
                        className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-full
              border
              border-black/[0.09]
              bg-white
              px-5
              text-[11px]
              font-bold
              text-[#444A44]
              transition
              hover:bg-[#F0F1EC]
            "
                    >
                        <RotateCcw className="h-3.5 w-3.5" />

                        Reset
                    </button>

                    <button
                        type="submit"
                        form="settings-form"
                        disabled={saving}
                        className="
              group
              inline-flex
              h-11
              items-center
              gap-4
              rounded-full
              bg-[#151814]
              pl-5
              pr-1.5
              text-[11px]
              font-bold
              text-white
              transition
              hover:bg-[#292F2A]
            "
                    >
                        {saving ? "Saving..." : "Save Settings"}

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D8FF65] text-[#151814]">
                            <Save className="h-3.5 w-3.5" />
                        </span>
                    </button>
                </div>
            </div>

            {/* =====================================================
          SUCCESS
      ====================================================== */}

            {loadError && (
                <div role="alert" className="mt-6 rounded-[16px] border border-amber-200 bg-amber-50 px-5 py-4 text-[12px] font-medium text-amber-800">
                    Could not load saved settings: {loadError}
                </div>
            )}

            {saveError && (
                <div role="alert" className="mt-6 rounded-[16px] border border-red-200 bg-red-50 px-5 py-4 text-[12px] font-medium text-red-700">
                    {saveError}
                </div>
            )}

            {saved && (
                <div className="mt-6 flex items-center justify-between gap-4 rounded-[16px] border border-green-100 bg-green-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                            <Check className="h-4 w-4" />
                        </span>

                        <div>
                            <p className="text-[12px] font-bold text-green-700">
                                Settings saved
                            </p>

                            <p className="mt-0.5 text-[10px] font-medium text-green-600">
                                Your configuration has been saved successfully.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSaved(false)}
                        className="text-green-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* =====================================================
          FORM
      ====================================================== */}

            <form
                id="settings-form"
                onSubmit={saveSettings}
                className="mt-7"
            >
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">

                    {/* =================================================
              LEFT
          ================================================== */}

                    <div className="space-y-6">

                        {/* =============================================
                COMPANY
            ============================================== */}

                        <SettingsSection
                            title="Company Information"
                            description="Main business information displayed across the platform."
                            icon={Building2}
                        >
                            <div className="grid gap-5 md:grid-cols-2">

                                <div className="md:col-span-2">
                                    <FormField label="Company Name">
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={settings.companyName}
                                            onChange={updateSetting}
                                            className={inputClass}
                                        />
                                    </FormField>
                                </div>

                                <FormField label="Business Email">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777E77]" />

                                        <input
                                            type="email"
                                            name="email"
                                            value={settings.email}
                                            onChange={updateSetting}
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </FormField>

                                <FormField label="Phone Number">
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777E77]" />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={settings.phone}
                                            onChange={updateSetting}
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </FormField>

                                <FormField label="WhatsApp">
                                    <div className="relative">
                                        <MessageCircle className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777E77]" />

                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            value={settings.whatsapp}
                                            onChange={updateSetting}
                                            placeholder="+971..."
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </FormField>

                                <FormField label="Business Location">
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777E77]" />

                                        <input
                                            type="text"
                                            name="address"
                                            value={defaultSettings.address}
                                            onChange={updateSetting}
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </FormField>

                            </div>
                        </SettingsSection>

                        {/* =============================================
                WEBSITE
            ============================================== */}

                        <SettingsSection
                            title="Website Settings"
                            description="Configure basic information for the customer-facing website."
                            icon={Globe2}
                        >
                            <div className="grid gap-5 md:grid-cols-2">

                                <FormField label="Website Name">
                                    <input
                                        type="text"
                                        name="websiteName"
                                        value={settings.websiteName}
                                        onChange={updateSetting}
                                        className={inputClass}
                                    />
                                </FormField>

                                <FormField label="Website URL">
                                    <input
                                        type="url"
                                        name="websiteUrl"
                                        value={settings.websiteUrl}
                                        onChange={updateSetting}
                                        placeholder="https://www.example.ae"
                                        className={inputClass}
                                    />
                                </FormField>

                                <FormField label="Currency">
                                    <div
                                        className={`relative ${currencyOpen ? "z-[100]" : "z-10"
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrencyOpen((prev) => !prev)
                                            }
                                            className={`
                        flex
                        h-[54px]
                        w-full
                        items-center
                        justify-between
                        rounded-[14px]
                        border
                        bg-[#F7F7F3]
                        pl-4
                        pr-2
                        text-left
                        transition

                        ${currencyOpen
                                                    ? "border-[#94BE26] bg-white ring-4 ring-[#D8FF65]/15"
                                                    : "border-black/[0.08]"
                                                }
                      `}
                                        >
                                            <span className="text-[12px] font-semibold text-[#252A25]">
                                                {settings.currency}
                                            </span>

                                            <span
                                                className={`
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          transition

                          ${currencyOpen
                                                        ? "rotate-180 bg-[#D8FF65]"
                                                        : ""
                                                    }
                        `}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </span>
                                        </button>

                                        {currencyOpen && (
                                            <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-[16px] border border-black/[0.08] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,.14)]">

                                                {["AED", "USD", "INR"].map(
                                                    (currency) => (
                                                        <button
                                                            key={currency}
                                                            type="button"
                                                            onClick={() => {
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    currency,
                                                                }));

                                                                setCurrencyOpen(false);
                                                            }}
                                                            className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-[11px]
                                px-3.5
                                py-3
                                text-[11px]
                                font-bold
                                transition

                                ${settings.currency === currency
                                                                    ? "bg-[#D8FF65] text-[#151814]"
                                                                    : "text-[#505750] hover:bg-[#F1F2ED]"
                                                                }
                              `}
                                                        >
                                                            {currency}

                                                            {settings.currency === currency && (
                                                                <Check className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>
                                                    )
                                                )}

                                            </div>
                                        )}
                                    </div>
                                </FormField>

                            </div>

                            {/* Website toggles */}

                            <div className="mt-6 space-y-3 border-t border-black/[0.07] pt-6">

                                <SettingsToggle
                                    title="WhatsApp Floating Button"
                                    description="Show WhatsApp contact button on the public website."
                                    checked={settings.showWhatsApp}
                                    onChange={() =>
                                        toggleSetting("showWhatsApp")
                                    }
                                />

                                <SettingsToggle
                                    title="Maintenance Mode"
                                    description="Temporarily restrict public website access during maintenance."
                                    checked={settings.maintenanceMode}
                                    onChange={() =>
                                        toggleSetting("maintenanceMode")
                                    }
                                    warning
                                />

                            </div>
                        </SettingsSection>

                        {/* =============================================
                QUOTATION
            ============================================== */}

                        <SettingsSection
                            title="Quotation Settings"
                            description="Default values used when managing customer quotation requests."
                            icon={ReceiptText}
                        >
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                                <FormField label="Quotation Prefix">
                                    <input
                                        type="text"
                                        name="quotationPrefix"
                                        value={settings.quotationPrefix}
                                        onChange={updateSetting}
                                        placeholder="QT"
                                        className={inputClass}
                                    />
                                </FormField>

                                <FormField label="Validity Period">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            name="quotationValidity"
                                            value={settings.quotationValidity}
                                            onChange={updateSetting}
                                            className={`${inputClass} pr-16`}
                                        />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#747A74]">
                                            Days
                                        </span>
                                    </div>
                                </FormField>

                                <FormField label="VAT">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            name="vatRate"
                                            value={settings.vatRate}
                                            onChange={updateSetting}
                                            className={`${inputClass} pr-12`}
                                        />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#747A74]">
                                            %
                                        </span>
                                    </div>
                                </FormField>

                            </div>
                        </SettingsSection>

                        {/* =============================================
                NOTIFICATIONS
            ============================================== */}

                        <SettingsSection
                            title="Notifications"
                            description="Choose which administrator alerts should be enabled."
                            icon={Bell}
                        >
                            <div className="space-y-3">

                                <SettingsToggle
                                    title="Email Notifications"
                                    description="Receive general administrative email notifications."
                                    checked={settings.emailNotifications}
                                    onChange={() =>
                                        toggleSetting("emailNotifications")
                                    }
                                />

                                <SettingsToggle
                                    title="New Quotation Notifications"
                                    description="Receive an alert whenever a customer submits a new quotation request."
                                    checked={
                                        settings.quotationNotifications
                                    }
                                    onChange={() =>
                                        toggleSetting(
                                            "quotationNotifications"
                                        )
                                    }
                                />

                                <SettingsToggle
                                    title="Customer Notifications"
                                    description="Receive notifications for new or updated customer information."
                                    checked={
                                        settings.customerNotifications
                                    }
                                    onChange={() =>
                                        toggleSetting(
                                            "customerNotifications"
                                        )
                                    }
                                />

                            </div>
                        </SettingsSection>
                    </div>

                    {/* =================================================
              RIGHT
          ================================================== */}

                    <aside className="space-y-6 xl:sticky xl:top-24">

                        {/* LOGO */}

                        <div className="overflow-hidden rounded-[22px] border border-[#DADCD5] bg-white shadow-[0_10px_35px_rgba(20,24,20,.04)]">

                            <div className="border-b border-black/[0.07] p-5">

                                <div className="flex items-center gap-3">

                                    <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#EEF1E7]">
                                        <ImagePlus className="h-4 w-4" />
                                    </span>

                                    <div>
                                        <p className="text-[12px] font-bold text-[#202420]">
                                            Company Logo
                                        </p>

                                        <p className="mt-0.5 text-[10px] font-medium text-[#777E77]">
                                            Admin and website branding
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="p-5">

                                {logo ? (
                                    <>
                                        <div className="relative flex aspect-[16/8] items-center justify-center overflow-hidden rounded-[17px] bg-[#151814] p-6">

                                            <img
                                                src={logo}
                                                alt="Company logo"
                                                className="max-h-full max-w-full object-contain"
                                            />

                                            <button
                                                type="button"
                                                onClick={removeLogo}
                                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#151814] transition hover:bg-red-500 hover:text-white"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-black/[0.08] text-[10px] font-bold text-[#505750]"
                                        >
                                            <Upload className="h-3.5 w-3.5" />
                                            Change Logo
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="
                      group
                      flex
                      aspect-[16/8]
                      w-full
                      flex-col
                      items-center
                      justify-center
                      rounded-[17px]
                      border
                      border-dashed
                      border-black/15
                      bg-[#F5F5F0]
                      p-5
                      text-center
                      transition
                      hover:border-[#94BE26]
                    "
                                    >
                                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:bg-[#D8FF65]">
                                            <Upload className="h-4 w-4" />
                                        </span>

                                        <p className="mt-3 text-[10px] font-bold text-[#303630]">
                                            Upload Logo
                                        </p>

                                        <p className="mt-1 text-[9px] text-[#858B85]">
                                            PNG, JPG or WebP
                                        </p>
                                    </button>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleLogo}
                                    className="hidden"
                                />

                            </div>
                        </div>

                        {/* SYSTEM */}

                        <div className="rounded-[22px] bg-[#151814] p-5 text-white shadow-[0_18px_50px_rgba(20,24,20,.13)]">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#D8FF65]">
                                        System
                                    </p>

                                    <h3 className="mt-2 text-[19px] font-semibold">
                                        Platform Status
                                    </h3>
                                </div>

                                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#D8FF65] text-[#151814]">
                                    <Settings className="h-4 w-4" />
                                </span>

                            </div>

                            <div className="mt-6 space-y-4 border-t border-white/10 pt-5">

                                <SystemRow
                                    label="Website"
                                    value={
                                        settings.maintenanceMode
                                            ? "Maintenance"
                                            : "Online"
                                    }
                                />

                                <SystemRow
                                    label="Currency"
                                    value={settings.currency}
                                />

                                <SystemRow
                                    label="VAT"
                                    value={`${settings.vatRate}%`}
                                />

                                <SystemRow
                                    label="Quotation"
                                    value={`${settings.quotationValidity} Days`}
                                />

                            </div>
                        </div>

                        {/* SECURITY */}

                        <div className="rounded-[22px] border border-[#DADCD5] bg-white p-5 shadow-[0_10px_35px_rgba(20,24,20,.04)]">

                            <div className="flex gap-3">

                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#EEF1E7]">
                                    <ShieldCheck className="h-4 w-4 text-[#526046]" />
                                </span>

                                <div>
                                    <p className="text-[12px] font-bold text-[#202420]">
                                        Administrator Security
                                    </p>

                                    <p className="mt-1 text-[10px] leading-5 text-[#747A74]">
                                        User authentication and permissions can be connected
                                        to your backend security system.
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* MOBILE SAVE */}

                        <button
                            type="submit"
                            className="
                group
                flex
                h-[58px]
                w-full
                items-center
                justify-between
                rounded-full
                bg-[#D8FF65]
                pl-6
                pr-2
                text-[12px]
                font-bold
                text-[#151814]
                transition
                hover:bg-[#151814]
                hover:text-white
              "
                        >
                            <span className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Save Settings
                            </span>

                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#151814] text-white transition group-hover:bg-white group-hover:text-[#151814]">
                                <Check className="h-4 w-4" />
                            </span>
                        </button>

                    </aside>
                </div>
            </form>
        </div>
    );
}

/* =========================================================
   SETTINGS SECTION
========================================================= */

function SettingsSection({
    title,
    description,
    icon: Icon,
    children,
}) {
    return (
        <section className="overflow-visible rounded-[22px] border border-[#DADCD5] bg-white shadow-[0_10px_35px_rgba(20,24,20,.04)]">

            <div className="flex items-start gap-3 border-b border-black/[0.07] p-5 sm:p-6">

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#EEF1E7]">
                    <Icon className="h-4 w-4 text-[#505850]" />
                </span>

                <div>
                    <h2 className="text-[13px] font-bold text-[#202420]">
                        {title}
                    </h2>

                    <p className="mt-1 text-[10px] leading-5 text-[#747A74]">
                        {description}
                    </p>
                </div>

            </div>

            <div className="p-5 sm:p-6">
                {children}
            </div>

        </section>
    );
}

/* =========================================================
   FIELD
========================================================= */

function FormField({
    label,
    children,
}) {
    return (
        <div className="min-w-0">

            <label className="mb-2.5 block text-[10px] font-bold text-[#626962]">
                {label}
            </label>

            {children}

        </div>
    );
}

/* =========================================================
   TOGGLE
========================================================= */

function SettingsToggle({
    title,
    description,
    checked,
    onChange,
    warning = false,
}) {
    return (
        <div className="flex items-start justify-between gap-5 rounded-[17px] border border-black/[0.06] bg-[#F7F7F3] p-4 sm:p-5">

            <div className="min-w-0">
                <p
                    className={`text-[11px] font-bold ${warning
                            ? "text-[#8B5D13]"
                            : "text-[#303630]"
                        }`}
                >
                    {title}
                </p>

                <p className="mt-1 max-w-xl text-[10px] leading-5 text-[#747A74]">
                    {description}
                </p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={onChange}
                className={`
          relative
          h-7
          w-12
          shrink-0
          rounded-full
          transition-all
          duration-300

          ${checked
                        ? warning
                            ? "bg-[#D78B31]"
                            : "bg-[#151814]"
                        : "bg-[#D9DDD6]"
                    }
        `}
            >
                <span
                    className={`
            absolute
            top-1
            h-5
            w-5
            rounded-full
            transition-all
            duration-300

            ${checked
                            ? "left-6 bg-[#D8FF65]"
                            : "left-1 bg-white"
                        }
          `}
                />
            </button>

        </div>
    );
}

/* =========================================================
   SYSTEM ROW
========================================================= */

function SystemRow({
    label,
    value,
}) {
    return (
        <div className="flex items-center justify-between gap-5">

            <span className="text-[10px] font-medium text-[#ADB3AD]">
                {label}
            </span>

            <span className="text-[10px] font-bold text-white">
                {value}
            </span>

        </div>
    );
}

/* =========================================================
   INPUT
========================================================= */

const inputClass = `
  h-[54px]
  w-full
  min-w-0
  rounded-[14px]
  border
  border-black/[0.08]
  bg-[#F7F7F3]
  px-4
  text-[12px]
  font-semibold
  text-[#252A25]
  outline-none
  transition-all
  placeholder:font-medium
  placeholder:text-[#969B96]
  hover:border-black/15
  focus:border-[#94BE26]
  focus:bg-white
  focus:ring-4
  focus:ring-[#D8FF65]/15
`;