"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import { useChat } from "ai/react";

export default function Page() {
   const [name, setName] = useState("");
   const [bio, setBio] = useState("");
   const [vibe, setVibe] = useState<VibeType>("Pun");
   const bioRef = useRef<null | HTMLDivElement>(null);

   const scrollToBios = () => {
      if (bioRef.current !== null) {
         bioRef.current.scrollIntoView({ behavior: "smooth" });
      }
   };

   const { setInput, handleSubmit, isLoading, messages } = useChat({
      body: {
         name,
         vibe,
         bio,
      },
      onResponse() {
         scrollToBios();
      },
   });

   const lastMessage = messages[messages.length - 1];
   const generatedBios = lastMessage?.role === "assistant" ? lastMessage.content : null;

   return (
      <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
         <Header />
         <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
            <a
               className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
               href="https://github.com/Nutlope/twitterbio"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Github />
               <p>Star on GitHub</p>
            </a>
            <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
            Compose Flirty Messages, Lyrics, and Puns Tailored to Any Profile!
            </h1>
            <p className="text-slate-500 mt-5">47,118 msgs generated so far.</p>
            <form
               className="max-w-xl w-full"
               onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                  setInput(bio);
               }}
            >
               <div className="flex mt-10 items-center space-x-3">
                  <Image src="/1-black.png" width={30} height={30} alt="1 icon" className="mb-5 sm:mb-0" />
                  <p className="text-left font-medium">Enter Name</p>
               </div>
               <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                  placeholder="e.g. Aditi Goyal "
               />
               <div className="flex mt-10 items-center space-x-3">
                  <Image src="/2-black.png" width={30} height={30} alt="1 icon" className="mb-5 sm:mb-0" />
                  <p className="text-left font-medium">
                    Add the user bio{" "}
                     <span className="text-slate-500">(or write a few sentences about them)</span>.
                  </p>
               </div>
               <textarea
                  value={bio}
                  onChange={(e) => {
                    setInput(e.target.value);
                     setBio(e.target.value);
                  }}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                  placeholder={
                     "e.g. Looking for something meanifull, loves coffee and traveling. Liverpool and Formula 1 fan."
                  }
               />
               <div className="flex mb-5 items-center space-x-3">
                  <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
                  <p className="text-left font-medium">Select msg type.</p>
               </div>
               <div className="block">
                  <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
               </div>

               {!isLoading && (
                  <button
                     className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                     type="submit"
                  >
                     Generate your msg &rarr;
                  </button>
               )}
               {isLoading && (
                  <button
                     className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                     disabled
                  >
                     <span className="loading">
                        <span style={{ backgroundColor: "white" }} />
                        <span style={{ backgroundColor: "white" }} />
                        <span style={{ backgroundColor: "white" }} />
                     </span>
                  </button>
               )}
            </form>
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 2000 }} />
            <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
            <output className="space-y-10 my-10">
               {generatedBios && (
                  <>
                     <div>
                        <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto" ref={bioRef}>
                           Your generated bios
                        </h2>
                     </div>
                     <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                        {generatedBios
                           .substring(generatedBios.indexOf("1") + 3)
                           .split("2.")
                           .map((generatedBio) => {
                              return (
                                 <div
                                    className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                                    onClick={() => {
                                       navigator.clipboard.writeText(generatedBio);
                                       toast("Bio copied to clipboard", {
                                          icon: "✂️",
                                       });
                                    }}
                                    key={generatedBio}
                                 >
                                    <p>{generatedBio}</p>
                                 </div>
                              );
                           })}
                     </div>
                  </>
               )}
            </output>
         </main>
         <Footer />
      </div>
   );
}