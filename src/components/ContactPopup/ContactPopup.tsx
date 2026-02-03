import React, { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-[#95D5B2] px-4 py-2 bg-[#F8F9F1] text-[#1B4332] placeholder:text-[#6D4C41] outline-none transition hover:border-[#2D6A4F] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/30";

const ContactPopup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"details" | "whatsapp">("details");
  const [propertyType, setPropertyType] = useState("");

  const openWhatsApp = () => {
    const phone = "919999999999";
    const message = encodeURIComponent("Hi, I’m interested in your property.");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-5 bg-[#D8F3DC] p-5 rounded-2xl">
      <div className="flex bg-[#95D5B2]/40 rounded-full p-1">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "details"
              ? "bg-[#F8F9F1] text-[#1B4332] shadow"
              : "text-[#1B4332]"
          }`}
        >
          Share Details
        </button>

        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "whatsapp"
              ? "bg-[#F8F9F1] text-[#1B4332] shadow"
              : "text-[#1B4332]"
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
                propertyType ? "text-[#1B4332]" : "text-[#6D4C41]"
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

          <p className="text-sm text-[#6D4C41]">
            Name and phone are required.
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              type="reset"
              className="border border-[#2D6A4F] text-[#2D6A4F] px-4 py-2 rounded-full hover:bg-[#95D5B2]/40 transition"
            >
              Reset
            </button>

            <button
              type="submit"
              className="bg-[#2D6A4F] text-white px-5 py-2 rounded-full hover:bg-[#1B4332] transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {activeTab === "whatsapp" && (
        <div className="space-y-4">
          <div className="border border-[#95D5B2] bg-[#F8F9F1] rounded-xl p-4 text-sm space-y-2">
            <p className="font-medium text-[#1B4332]">
              Prefer a quick chat? Ping us on WhatsApp.
            </p>

            <ul className="list-disc pl-5 space-y-1 text-[#6D4C41]">
              <li>Instant conversation with a specialist</li>
              <li>Share images / location pins easily</li>
              <li>Service hours: 9am – 7pm IST</li>
              <li>We usually reply within a few minutes</li>
            </ul>
          </div>

          <button
            onClick={openWhatsApp}
            className="bg-[#2D6A4F] text-white px-5 py-2 rounded-full hover:bg-[#1B4332] transition w-full sm:w-auto"
          >
            Open WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactPopup;
