import BaseHeader from "@/components/base-header";
import Footer2 from "@/components/sections/footer2";
import { BorderAllIcon } from "@radix-ui/react-icons";


export default function Contact(){

    return (
        <>
        <BaseHeader />
        <div className="min-h-screen flex space-y-6 items-center justify-center p-6">
            
            <div className="w-full  mx-auto pt-32 pb-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Contact Us
                </h1>
                <p className="text-center text-gray-600 mb-2">
                Have questions or feedback? Fill out the form below and we’ll get back
                to you within one business day.
                </p>
                <p className="text-center text-gray-600 mb-8">
                    For common questions, check the FAQ or email <a className="text-[#00a4c6] font-bold" href="mailto:support@outaudits.com">support@outaudits.com</a>
                </p>
                
                <iframe src="https://app.antforms.com/forms/outaudits-contact-mstm7fyh" width="100%" height="600" frameBorder="1" className="border border-gray-200 rounded-xl" ></iframe>

            </div>
            
        </div>
        <Footer2 />
        </>
    )
}
