import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "@/lib/apiClient";
import { translateApiValue } from "@/lib/i18nHelpers";

type Stat = {
  value: string;
  label: string;
};

type StatsContent = {
  title?: string;
  subtitle?: string;
  description?: string;
  stats?: Stat[];
};

type StatApiItem = {
  value?: string | number;
  number?: string | number;
  count?: string | number;
  label?: string;
  title?: string;
  name?: string;
};

const StatsSection: React.FC = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState<StatsContent | null>(null);

  useEffect(() => {
    let active = true;

    const loadClientStats = async () => {
      try {
        const response = await api.get("/client-stats");
        const payload = response.data?.data?.stats ?? response.data?.data ?? response.data;
        if (!payload || !active) return;

        const rawStats =
          payload?.stats ??
          payload?.clientStats ??
          payload?.client_stats ??
          payload?.statistics ??
          payload?.items;

        const mappedStats: Stat[] = (Array.isArray(rawStats) ? rawStats : [])
          .map((item: StatApiItem) => ({
            value: String(item?.value ?? item?.number ?? item?.count ?? ""),
            label: item?.label ?? item?.title ?? item?.name ?? "",
          }))
          .filter((item: Stat) => item.value && item.label);

        setContent({
          title: payload?.title ?? payload?.heading,
          subtitle: payload?.subtitle ?? payload?.subTitle ?? payload?.sub_heading,
          description: payload?.description ?? payload?.content ?? payload?.body,
          stats: mappedStats,
        });
      } catch (error) {
        console.error("Failed to load client stats:", error);
      }
    };

    loadClientStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="w-full bg-gradient-to-br from-green-50 via-white to-green-100 py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {content && (
          <>
            {/* 🔝 Trust Content */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {content?.title}
            </h2>

            <p className="mt-3 text-lg font-semibold text-green-700">
              {content?.subtitle}
            </p>

            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {content?.description}
            </p>

            {/* Divider */}
            <div className="w-24 h-1 bg-green-600 mx-auto my-10 rounded-full"></div>

            {/* 📊 Stats Strip (NO CARDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {content?.stats?.map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-5xl font-extrabold text-green-700">
                    {stat?.value}
                  </h3>
                  <p className="mt-2 text-sm font-medium uppercase tracking-wider text-gray-600">
                    {translateApiValue("statsSection.labels", stat?.label, stat?.label)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default StatsSection;
