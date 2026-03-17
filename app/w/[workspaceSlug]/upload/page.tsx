import { LocalUploadForm } from "@/components/workspace/local-upload-form";
import { EmptyState } from "@/components/ui/empty-state";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function UploadPage() {
  const state = await getLocalStudioState();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="surface-panel p-6 text-white">
        <h2 className="text-3xl font-semibold">Local media ingestion</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Upload directly from this machine. Files are written into the local
          `uploads/private-studio` directory and registered inside REEL.ai’s
          private studio state.
        </p>
        <div className="mt-6">
          <LocalUploadForm />
        </div>
      </div>
      <div className="light-panel p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Uploaded assets</p>
        {state.uploads.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="No media uploaded yet"
              description="Once you add media here, REEL.ai will create local project shells for videos and audio files so you can move into diagnosis and editing."
            />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {state.uploads.map((upload) => (
              <div key={upload.id} className="rounded-[22px] border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-slate-950">{upload.originalName}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {upload.kind} · {Math.round(upload.sizeBytes / 1024 / 1024)} MB
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    stored locally
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
