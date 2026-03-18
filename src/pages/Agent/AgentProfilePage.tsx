import React, { useState } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { Input, Button } from "@/components/common";

const AgentProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user?.name ?? "");
  const [experienceYears, setExperienceYears] = useState("");
  const [specialization, setSpecialization] = useState("");

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
          Agent Profile
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Update your profile and specialization.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="experienceYears"
              >
                Experience (years)
              </label>
              <Input
                id="experienceYears"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                inputMode="numeric"
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
                placeholder="e.g. 3"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="specialization"
            >
              Specialization
            </label>
            <Input
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              placeholder="Farmhouse, Resorts, Agricultural land..."
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AgentProfilePage;

