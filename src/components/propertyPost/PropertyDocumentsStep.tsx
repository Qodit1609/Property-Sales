import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { saveDraftNow, setDocuments as setDocumentPreviews } from "../../features/postProperty/postPropertySlice";
import FormActions from "./FormActions";
import type { PostPropertyOutletContext } from "./postPropertyOutletContext";
import DocumentUploadCard, { type DocumentFileKey } from "./DocumentUploadCard";
import { useTranslation } from "react-i18next";

type DocumentsState = Partial<Record<DocumentFileKey, File | null>>;

const initialDocs: DocumentsState = {
  landRegistry: null,
  khasra: null,
  ownership: null,
  previousRegistry: null,
  mutation: null,
  encumbrance: null,
  soil: null,
  water: null,
  irrigation: null,
  electricity: null,
  tax: null,
  noc: null,
  landUse: null,
};

export default function PropertyDocumentsStep() {
  const { t } = useTranslation();
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const basic = useAppSelector((s) => s.postProperty.basicDetails);

  const [documents, setDocuments] = useState<DocumentsState>(initialDocs);

  const strictAgSell = useMemo(
    () => basic.listingType === "sell" && basic.category === "Agriculture Land",
    [basic.listingType, basic.category]
  );

  const onFileChange = useCallback((key: DocumentFileKey, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
  }, []);

  const onNext = () => {
    dispatch(saveDraftNow());
    pushToast({ kind: "success", title: t("postProperty.toast.draftSaved") });
    navigate("/post-property/amenities");
  };

  useEffect(() => {
    let isCancelled = false;

    const toDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => reject(new Error("Failed to read document"));
        reader.readAsDataURL(file);
      });

    const syncDocumentPreviews = async () => {
      const entries = Object.entries(documents).filter((entry): entry is [string, File] => Boolean(entry[1]));
      const items = await Promise.all(
        entries.map(async ([key, file]) => ({
          id: `doc-${key}`,
          url: await toDataUrl(file),
          source: "local" as const,
          fileName: file.name,
          sizeBytes: file.size,
          mimeType: file.type,
        }))
      );

      if (!isCancelled) {
        dispatch(setDocumentPreviews(items));
      }
    };

    void syncDocumentPreviews();

    return () => {
      isCancelled = true;
    };
  }, [dispatch, documents]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--b1)]">{t("postProperty.documents.stepTitle")}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {t("postProperty.documents.stepSubtitle")}
      </p>

      {strictAgSell ? (
        <div className="mt-4 rounded-xl border border-[var(--warning)] bg-[var(--warning-bg)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--warning)]">
            {t("postProperty.documents.requiredAgriSelling")}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {t("postProperty.documents.requiredAgriSellingHint")}
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)] px-4 py-3">
          <p className="text-sm font-medium text-[var(--b1)]">
            {t("postProperty.documents.optionalForRent")}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">{t("postProperty.documents.staticPlaceholder")}</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.documents.requiredDocuments")}</p>
        <div className="grid grid-cols-1 gap-4">
          <DocumentUploadCard
            title={t("postProperty.documents.landRegistry")}
            required={strictAgSell}
            description={strictAgSell ? t("postProperty.documents.requiredAgriSelling") : undefined}
            documentKey="landRegistry"
            file={documents.landRegistry ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.latestKhasra")}
            required={strictAgSell}
            description={strictAgSell ? t("postProperty.documents.requiredAgriSelling") : undefined}
            documentKey="khasra"
            file={documents.khasra ?? null}
            onFileChange={onFileChange}
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.documents.optionalDocuments")}</p>
        <div className="grid grid-cols-1 gap-4">
          <DocumentUploadCard
            title={t("postProperty.documents.ownershipProof")}
            documentKey="ownership"
            file={documents.ownership ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.previousRegistry")}
            documentKey="previousRegistry"
            file={documents.previousRegistry ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.mutationCertificate")}
            documentKey="mutation"
            file={documents.mutation ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.encumbranceCertificate")}
            documentKey="encumbrance"
            file={documents.encumbrance ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.soilReport")}
            documentKey="soil"
            file={documents.soil ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.waterAvailabilityCertificate")}
            documentKey="water"
            file={documents.water ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.irrigationProof")}
            documentKey="irrigation"
            file={documents.irrigation ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.electricityProof")}
            documentKey="electricity"
            file={documents.electricity ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.taxReceipt")}
            documentKey="tax"
            file={documents.tax ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.noc")}
            documentKey="noc"
            file={documents.noc ?? null}
            onFileChange={onFileChange}
          />
          <DocumentUploadCard
            title={t("postProperty.documents.landUseCertificate")}
            documentKey="landUse"
            file={documents.landUse ?? null}
            onFileChange={onFileChange}
          />
        </div>
      </div>

      <FormActions
        onBack={() => navigate("/post-property/media")}
        onNext={onNext}
        nextLabel={t("postProperty.common.continue")}
      />
    </div>
  );
}
