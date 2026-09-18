"use client"

export default function DispatchPage() {
  return (
    <section className="flex size-full flex-col">
      <h1 className="border-b px-4 py-3 text-lg font-semibold">每日派工</h1>
      <iframe
        title="每日派工：上傳、預覽與主管確認"
        src="/api/dispatch/ui"
        className="min-h-[70vh] w-full flex-1 border-0"
      />
    </section>
  )
}
