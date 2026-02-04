import React, { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-[var(--b2)] px-4 py-2 bg-[var(--fg)] text-[var(--b1)] placeholder:text-[var(--brown)] outline-none transition hover:border-[var(--b1-mid)] focus:border-[var(--b1-mid)] focus:ring-2 focus:ring-[var(--b1-mid)]/30";

const ContactPopup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"details" | "whatsapp">("details");
  const [propertyType, setPropertyType] = useState("");

  const openWhatsApp = () => {
    const phone = "919999999999";
    const message = encodeURIComponent("Hi, I’m interested in your property.");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-5 bg-[var(--b2-soft)] p-5 rounded-2xl">
      <div className="flex bg-[var(--b2)]/40 rounded-full p-1">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "details"
              ? "bg-[var(--fg)] text-[var(--b1)] shadow"
              : "text-[var(--b1)]"
          }`}
        >
          Share Details
        </button>

        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "whatsapp"
              ? "bg-[var(--fg)] text-[var(--b1)] shadow"
              : "text-[var(--b1)]"
          }`}
        >
          WhatsApp
        </button>
      </div>

      {activeTab === "details" && (
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className={inputClass} placeholder="you@example.com" />
            <input className={inputClass} placeholder="Your name *" />
            <input className={inputClass} placeholder="Phone *" />

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={`${inputClass} ${
                propertyType
                  ? "text-[var(--b1)]"
                  : "text-[var(--brown)]"
              }`}
            >
              <option value="" disabled>
                Select property type
              </option>
              <option>Farmhouse</option>
              <option>Agriculture Land</option>
              <option>Resort Property</option>
            </select>

            <input
              className={`${inputClass} md:col-span-2`}
              placeholder="Budget in numbers"
            />
          </div>

          <textarea
            rows={3}
            className={inputClass}
            placeholder="Tell us more about what you need"
          />

          <p className="text-sm text-[var(--brown)]">
            Name and phone are required.
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              type="reset"
              className="border border-[var(--b1-mid)] text-[var(--b1-mid)] px-4 py-2 rounded-full hover:bg-[var(--b2)]/40 transition"
            >
              Reset
            </button>

            <button
              type="submit"
              className="bg-[var(--b1-mid)] text-[var(--white)] px-5 py-2 rounded-full hover:bg-[var(--b1)] transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {activeTab === "whatsapp" && (
        <div className="space-y-4">
          <div className="border border-[var(--b2)] bg-[var(--fg)] rounded-xl p-4 text-sm space-y-2">
            <p className="font-medium text-[var(--b1)]">
              Prefer a quick chat? Ping us on WhatsApp.
            </p>

            <ul className="list-disc pl-5 space-y-1 text-[var(--brown)]">
              <li>Instant conversation with a specialist</li>
              <li>Share images / location pins easily</li>
              <li>Service hours: 9am – 7pm IST</li>
              <li>We usually reply within a few minutes</li>
            </ul>
          </div>

          <button
            onClick={openWhatsApp}
            className="bg-[var(--b1-mid)] text-[var(--white)] px-5 py-2 rounded-full hover:bg-[var(--b1)] transition w-full sm:w-auto"
          >
            Open WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactPopup;
