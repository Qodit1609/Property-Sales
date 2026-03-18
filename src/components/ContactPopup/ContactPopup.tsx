import React, { useState } from "react";
import { Button, Input, Card } from "@/components/common";

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
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-[var(--b2)]/40 rounded-full p-1 max-w-md mx-auto">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveTab("details")}
          className={`flex-1 py-2 rounded-full text-sm font-medium ${
            activeTab === "details"
              ? "bg-[var(--fg)] text-[var(--b1)] shadow"
              : "text-[var(--b1)]"
          }`}
        >
          Share Details
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveTab("whatsapp")}
          className={`flex-1 py-2 rounded-full text-sm font-medium ${
            activeTab === "whatsapp"
              ? "bg-[var(--fg)] text-[var(--b1)] shadow"
              : "text-[var(--b1)]"
          }`}
        >
          WhatsApp
        </Button>
      </div>

      {/* DETAILS FORM */}
      {activeTab === "details" && (
        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className={inputClass} placeholder="you@example.com" />
            <input className={inputClass} placeholder="Your name *" />
            <input className={inputClass} placeholder="Phone *" />

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={`${inputClass} ${
                propertyType ? "text-[var(--b1)]" : "text-[var(--brown)]"
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

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <Button
              type="reset"
              variant="outline"
              className="px-4 py-2 rounded-full text-[var(--b1-mid)] border-[var(--b1-mid)] hover:bg-[var(--b2)]/40"
            >
              Reset
            </Button>

            <Button
              type="submit"
              variant="primary"
              className="px-6 py-2 rounded-full"
            >
              Submit
            </Button>
          </div>
        </form>
      )}

      {/* WHATSAPP SECTION */}
      {activeTab === "whatsapp" && (
        <div className="space-y-5 text-center">
          <div className="border border-[var(--b2)] bg-[var(--fg)] rounded-xl p-5 text-sm space-y-3">
            <p className="font-medium text-[var(--b1)]">
              Prefer a quick chat?
            </p>

            <p className="text-[var(--brown)]">
              Connect with our property specialist instantly on WhatsApp.
            </p>

            <ul className="text-left list-disc pl-5 space-y-1 text-[var(--brown)]">
              <li>Instant conversation with expert</li>
              <li>Share images and locations</li>
              <li>Service hours: 9AM – 7PM IST</li>
              <li>Average reply within minutes</li>
            </ul>
          </div>

          <Button
            onClick={openWhatsApp}
            variant="primary"
            className="px-6 py-3 rounded-full w-full sm:w-auto"
          >
            Open WhatsApp Chat
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactPopup;