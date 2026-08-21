// components/MonthlyReport.tsx
import Image from "next/image";

interface MonthlyReportProps {
  reportImage: string; // path or URL to the dashboard image
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ reportImage }) => {
  return (
    <div className="relative overflow-hidden flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700">
      {/* Centered content (optional heading) */}
      <div className="absolute top-8 text-center text-white">
        <h1 className="text-3xl font-bold">Monthly Report</h1>
      </div>

      {/* Bottom-center image container */}
      <div className="absolute bottom-[-20px] w-[90%] max-w-4xl mx-auto">
        <div className="border border-white/20 bg-white/10 backdrop-blur-md rounded-tr-3xl rounded-tl-3xl p-4 shadow-xl overflow-hidden">
          <Image
            src={reportImage}
            alt="Dashboard Report"
            width={1200}
            height={800}
            className="rounded-tr-3xl rounded-tl-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
