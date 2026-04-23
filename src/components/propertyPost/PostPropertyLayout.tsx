import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Stepper from "./Stepper";
import { POST_PROPERTY_STEPS } from "./stepConfig";
import { ToastStack, type ToastMessage } from "./Toast";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  hydrateFromAuth,
  markDraftSaved,
} from "../../features/postProperty/postPropertySlice";
import {
  validateBasicDetails,
  validateLocationDetails,
  validateMedia,
  validateProfileDetails,
} from "../../features/postProperty/postPropertyValidation";
import Header from "../Header/Header";  // 👈 ADD THIS
import { useTranslation } from "react-i18next";

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function PostPropertyLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((s) => s.auth.user);
  const post = useAppSelector((s) => s.postProperty);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const pushToast = useCallback((t: Omit<ToastMessage, "id">) => {
    setToasts((prev) => [...prev, { ...t, id: nowId() }]);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (authUser) {
      dispatch(hydrateFromAuth({ name: authUser.name, email: authUser.email }));
    }
  }, [authUser, dispatch]);

  // Debounced autosave draft into localStorage
  useEffect(() => {
    if (!post.draftState.isDirty) return;
    const timer = window.setTimeout(() => {
      dispatch(markDraftSaved());
    }, 900);
    return () => window.clearTimeout(timer);
  }, [dispatch, post.draftState.isDirty]);

  const activePath = location.pathname;
  const documentsStepDone =
    activePath === "/post-property/amenities" ||
    activePath === "/post-property/review" ||
    post.completedSteps.amenities;
  const activeKey = useMemo(() => {
    return (
      POST_PROPERTY_STEPS.find((s) => s.path === activePath)?.key ?? "basic"
    );
  }, [activePath]);

  const stepStatuses = useMemo(() => {
    const basicOk =
      Object.keys(validateBasicDetails(post.basicDetails)).length === 0;
    const locationBaseOk =
      Object.keys(validateLocationDetails(post.locationDetails)).length === 0;
    const profileOk =
      Object.keys(validateProfileDetails(post.profileDetails, post.basicDetails)).length === 0;
    const mediaOk = Object.keys(validateMedia(post.media)).length === 0;

    // Survey number required when Agriculture Land
    const surveyOk =
      post.basicDetails.category !== "Agriculture Land" ||
      Boolean(post.locationDetails.surveyNumber.trim());

    const locOk = locationBaseOk && surveyOk;

    const allContentStepsDone =
      basicOk &&
      post.completedSteps.basic &&
      locOk &&
      post.completedSteps.location &&
      profileOk &&
      post.completedSteps.profile &&
      mediaOk &&
      post.completedSteps.media &&
      post.completedSteps.amenities;

    const doneMap: Record<string, boolean> = {
      basic: basicOk && post.completedSteps.basic,
      location: locOk && post.completedSteps.location,
      profile: profileOk && post.completedSteps.profile,
      media: mediaOk && post.completedSteps.media,
      documents: documentsStepDone,
      amenities: post.completedSteps.amenities,
      // Review is complete when every prior step is valid and marked completed (ready for submit)
      review: allContentStepsDone,
    };

    const statuses: Record<string, "done" | "current" | "todo"> = {};
    for (const s of POST_PROPERTY_STEPS) {
      statuses[s.key] =
        s.key === activeKey ? "current" : doneMap[s.key] ? "done" : "todo";
    }
    return { statuses, doneMap };
  }, [
    activeKey,
    activePath,
    documentsStepDone,
    post.basicDetails,
    post.locationDetails,
    post.media,
    post.profileDetails,
    post.completedSteps,
  ]);

  const completionPercent = useMemo(() => {
    const keys = POST_PROPERTY_STEPS.map((s) => s.key);
    const doneCount = keys.filter((k) => stepStatuses.doneMap[k]).length;
    return Math.round((doneCount / keys.length) * 100);
  }, [stepStatuses.doneMap]);

  const onNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <>
      <Header forceSolid />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <Stepper
              activePath={activePath}
              completionPercent={completionPercent}
              stepStatuses={stepStatuses.statuses}
              onNavigate={onNavigate}
            />

            <section className="flex-1">
              <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm p-5 sm:p-6">
                <Suspense
                  fallback={
                    <div className="py-10 text-sm text-[var(--muted)]">
                      {t("postProperty.layout.loadingStep")}
                    </div>
                  }
                >
                  <Outlet context={{ pushToast }} />
                </Suspense>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

