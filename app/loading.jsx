export default function Loading() {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#07100D]">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/20 border-t-[#D8FF65]" />
        </div>
    );
}
