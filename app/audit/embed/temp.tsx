// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router';
// import gsap from 'gsap';
// import {
//   ArrowRight,
//   Code,
//   Copy,
//   CheckCircle2,
//   ToggleLeft,
//   ToggleRight,
//   Monitor,
//   Smartphone,
//   Tablet,
//   RefreshCw,
//   Globe,
// } from 'lucide-react';
// import DashboardLayout from '@/sections/DashboardLayout';

// export default function WidgetPage() {
//   const [copied, setCopied] = useState(false);
//   const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
//   const [config, setConfig] = useState({
//     title: 'Free SEO Audit',
//     subtitle: 'Enter your website URL for an instant analysis',
//     buttonText: 'Analyze',
//     primaryColor: '#00a4c6',
//     bgColor: '#ffffff',
//     textColor: '#141e27',
//     borderRadius: 8,
//     showLogo: true,
//     showPoweredBy: false,
//     requireEmail: true,
//     emailPlaceholder: 'Enter your email',
//     width: '100%',
//     shadow: true,
//   });
//   const previewRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!previewRef.current) return;
//     const ctx = gsap.context(() => {
//       gsap.fromTo('.widget-section > *', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' });
//     }, previewRef);
//     return () => ctx.revert();
//   }, []);

//   const embedCode = `<!-- OUTAudits Embed Widget -->
// <div id="outaudits-widget"></div>
// <script>
//   (function() {
//     var s = document.createElement('script');
//     s.src = 'https://cdn.outaudits.com/widget.js';
//     s.async = true;
//     s.onload = function() {
//       OutAudits.init({
//         apiKey: 'YOUR_API_KEY',
//         container: '#outaudits-widget',
//         theme: {
//           primaryColor: '${config.primaryColor}',
//           bgColor: '${config.bgColor}',
//           textColor: '${config.textColor}',
//           borderRadius: ${config.borderRadius},
//         },
//         fields: {
//           title: '${config.title}',
//           subtitle: '${config.subtitle}',
//           buttonText: '${config.buttonText}',
//           requireEmail: ${config.requireEmail},
//         },
//         branding: {
//           showLogo: ${config.showLogo},
//           showPoweredBy: ${config.showPoweredBy},
//         }
//       });
//     };
//     document.head.appendChild(s);
//   })();
// </script>`;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(embedCode);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

//   return (
//     <DashboardLayout>
//       <div className="p-4 lg:p-8 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <div className="flex items-center gap-2 text-sm mb-1">
//               <Link to="/dashboard" className="hover:underline" style={{ color: '#44576a' }}>Dashboard</Link>
//               <ArrowRight className="w-3 h-3" style={{ color: '#8896a4' }} />
//               <span style={{ color: '#141e27' }} className="font-medium">Embeddable Widget</span>
//             </div>
//             <h1 style={{ fontSize: 22, fontWeight: 700, color: '#141e27' }}>Widget Customizer</h1>
//             <p className="text-sm mt-0.5" style={{ color: '#44576a' }}>Configure and embed a white-label SEO audit form on any website</p>
//           </div>
//         </div>

//         <div ref={previewRef} className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 widget-section">
//           {/* Preview Area */}
//           <div className="space-y-4">
//             {/* Device toggles */}
//             <div className="flex items-center justify-between">
//               <h3 className="text-sm font-semibold" style={{ color: '#141e27' }}>Live Preview</h3>
//               <div className="flex items-center gap-1 p-1 rounded-md bg-white" style={{ border: '1px solid #e4e9ed' }}>
//                 {[
//                   { key: 'desktop' as const, icon: Monitor },
//                   { key: 'tablet' as const, icon: Tablet },
//                   { key: 'mobile' as const, icon: Smartphone },
//                 ].map((d) => (
//                   <button
//                     key={d.key}
//                     onClick={() => setPreviewDevice(d.key)}
//                     className="p-1.5 rounded bg-transparent border-none cursor-pointer"
//                     style={{ color: previewDevice === d.key ? '#00a4c6' : '#c1cfda' }}
//                   >
//                     <d.icon className="w-4 h-4" />
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Preview container */}
//             <div
//               className="rounded-md p-8 flex items-center justify-center transition-all duration-300"
//               style={{
//                 backgroundColor: '#e8ecf0',
//                 border: '1px solid #e4e9ed',
//                 minHeight: 400,
//               }}
//             >
//               <div
//                 className="transition-all duration-300"
//                 style={{ width: deviceWidths[previewDevice], maxWidth: '100%' }}
//               >
//                 {/* The Widget */}
//                 <div
//                   className="p-6 text-center transition-all"
//                   style={{
//                     backgroundColor: config.bgColor,
//                     borderRadius: config.borderRadius,
//                     boxShadow: config.shadow ? '0px 10px 40px rgba(0,0,0,0.08)' : 'none',
//                     border: `1px solid ${config.shadow ? 'transparent' : '#e4e9ed'}`,
//                   }}
//                 >
//                   {config.showLogo && (
//                     <div className="flex items-center justify-center gap-1 mb-4">
//                       <span className="text-sm font-bold" style={{ color: config.textColor }}>OUT</span>
//                       <span className="text-sm font-normal" style={{ color: config.textColor }}>Audits</span>
//                       <span className="w-1 h-1 rounded-full ml-0.5" style={{ backgroundColor: config.primaryColor }} />
//                     </div>
//                   )}
//                   <h4 className="text-lg font-bold" style={{ color: config.textColor }}>
//                     {config.title}
//                   </h4>
//                   <p className="text-sm mt-1" style={{ color: '#8896a4' }}>
//                     {config.subtitle}
//                   </p>

//                   {config.requireEmail && (
//                     <input
//                       type="email"
//                       placeholder={config.emailPlaceholder}
//                       className="w-full mt-4 px-3 py-2.5 rounded-md text-sm outline-none text-center"
//                       style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed', color: config.textColor }}
//                       readOnly
//                     />
//                   )}

//                   <div className="flex items-center gap-2 mt-3">
//                     <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#c1cfda' }} />
//                     <input
//                       type="text"
//                       placeholder="https://yourwebsite.com"
//                       className="flex-1 px-3 py-2.5 rounded-md text-sm outline-none"
//                       style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed', color: config.textColor }}
//                       readOnly
//                     />
//                   </div>

//                   <button
//                     className="w-full mt-4 py-2.5 rounded-md text-sm font-semibold text-white border-none cursor-default"
//                     style={{ backgroundColor: config.primaryColor, borderRadius: config.borderRadius }}
//                   >
//                     {config.buttonText}
//                   </button>

//                   {config.showPoweredBy && (
//                     <p className="text-[10px] mt-3" style={{ color: '#c1cfda' }}>
//                       Powered by OUTAudits
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Embed Code */}
//             <div className="bg-white rounded-md p-5" style={{ border: '1px solid #e4e9ed' }}>
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <Code className="w-4 h-4" style={{ color: '#00a4c6' }} />
//                   <h3 className="text-sm font-semibold" style={{ color: '#141e27' }}>Embed Code</h3>
//                 </div>
//                 <button
//                   onClick={handleCopy}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border-none cursor-pointer hover:opacity-90"
//                   style={{ backgroundColor: copied ? '#f0fdf4' : '#f5f7fa', color: copied ? '#34d399' : '#44576a' }}
//                 >
//                   {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
//                   {copied ? 'Copied!' : 'Copy'}
//                 </button>
//               </div>
//               <pre
//                 className="p-4 rounded-md text-xs overflow-x-auto"
//                 style={{ backgroundColor: '#141e27', color: '#c1cfda', fontFamily: 'monospace', lineHeight: '20px' }}
//               >
//                 {embedCode}
//               </pre>
//             </div>
//           </div>

//           {/* Configuration Sidebar */}
//           <div className="space-y-4">
//             <div className="bg-white rounded-md p-5" style={{ border: '1px solid #e4e9ed' }}>
//               <h3 className="text-sm font-semibold mb-4" style={{ color: '#141e27' }}>Content</h3>
//               <div className="space-y-4">
//                 {[
//                   { label: 'Widget Title', key: 'title' as const },
//                   { label: 'Subtitle', key: 'subtitle' as const },
//                   { label: 'Button Text', key: 'buttonText' as const },
//                   { label: 'Email Placeholder', key: 'emailPlaceholder' as const },
//                 ].map((field) => (
//                   <div key={field.key}>
//                     <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>{field.label}</label>
//                     <input
//                       type="text" value={config[field.key]}
//                       onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
//                       className="w-full px-3 py-2 rounded-md text-sm outline-none"
//                       style={{ border: '1px solid #e4e9ed', color: '#141e27' }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-md p-5" style={{ border: '1px solid #e4e9ed' }}>
//               <h3 className="text-sm font-semibold mb-4" style={{ color: '#141e27' }}>Appearance</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>Primary Color</label>
//                   <div className="flex items-center gap-2">
//                     <input type="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-none" />
//                     <span className="text-xs font-mono" style={{ color: '#8896a4' }}>{config.primaryColor}</span>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>Background Color</label>
//                   <div className="flex items-center gap-2">
//                     <input type="color" value={config.bgColor} onChange={(e) => setConfig({ ...config, bgColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-none" />
//                     <span className="text-xs font-mono" style={{ color: '#8896a4' }}>{config.bgColor}</span>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>Text Color</label>
//                   <div className="flex items-center gap-2">
//                     <input type="color" value={config.textColor} onChange={(e) => setConfig({ ...config, textColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-none" />
//                     <span className="text-xs font-mono" style={{ color: '#8896a4' }}>{config.textColor}</span>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium block mb-1.5" style={{ color: '#44576a' }}>Border Radius: {config.borderRadius}px</label>
//                   <input
//                     type="range" min={0} max={24} value={config.borderRadius}
//                     onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })}
//                     className="w-full accent-[#00a4c6]"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-md p-5" style={{ border: '1px solid #e4e9ed' }}>
//               <h3 className="text-sm font-semibold mb-4" style={{ color: '#141e27' }}>Behavior</h3>
//               <div className="space-y-3">
//                 {[
//                   { key: 'showLogo' as const, label: 'Show logo' },
//                   { key: 'showPoweredBy' as const, label: 'Show "Powered by" badge' },
//                   { key: 'requireEmail' as const, label: 'Require email before audit' },
//                   { key: 'shadow' as const, label: 'Drop shadow' },
//                 ].map((opt) => (
//                   <label key={opt.key} className="flex items-center justify-between cursor-pointer">
//                     <span className="text-sm" style={{ color: '#44576a' }}>{opt.label}</span>
//                     <button
//                       onClick={() => setConfig({ ...config, [opt.key]: !config[opt.key] })}
//                       className="bg-transparent border-none cursor-pointer"
//                     >
//                       {config[opt.key] ? (
//                         <ToggleRight className="w-6 h-6 text-[#00a4c6]" />
//                       ) : (
//                         <ToggleLeft className="w-6 h-6" style={{ color: '#c1cfda' }} />
//                       )}
//                     </button>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Reset */}
//             <button
//               onClick={() => setConfig({
//                 title: 'Free SEO Audit', subtitle: 'Enter your website URL for an instant analysis',
//                 buttonText: 'Analyze', primaryColor: '#00a4c6', bgColor: '#ffffff',
//                 textColor: '#141e27', borderRadius: 8, showLogo: true, showPoweredBy: false,
//                 requireEmail: true, emailPlaceholder: 'Enter your email', width: '100%', shadow: true,
//               })}
//               className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-md text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]"
//               style={{ borderColor: '#e4e9ed', color: '#44576a' }}
//             >
//               <RefreshCw className="w-4 h-4" />
//               Reset to Defaults
//             </button>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
