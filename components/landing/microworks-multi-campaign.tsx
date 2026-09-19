"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logos } from "@/public/ai-providers-logos/logos";

interface CampaignItemData {
  name: string;
  domain: string;
  src: string;
}

const INITIAL_CAMPAIGNS: CampaignItemData[] = [
  { name: "RLHF Preference Pairs", domain: "rlhf.monad.eth", src: "/autosend/images/csphere-com.png" },
  { name: "Smart Contract QA", domain: "audit.monad.eth", src: "/autosend/images/frostline-io.png" },
];

const AVAILABLE_CAMPAIGNS: CampaignItemData[] = [
  { name: "Vision Object Labeling", domain: "vision.monad.eth", src: "/autosend/images/nimbiq-app-com.png" },
  { name: "Multilingual Audio QA", domain: "audio.monad.eth", src: "/autosend/images/velox-io.png" },
  { name: "Sentiment Classification", domain: "sentiment.monad.eth", src: "/autosend/images/driftwork-net.png" },
  { name: "ZK Proof Validation", domain: "zk.monad.eth", src: "/autosend/images/lunark-ai.png" },
];

function CampaignRow({ campaign }: { campaign: CampaignItemData }) {
  return (
    <div className="flex items-center gap-3.5 flex-1">
      <img
        src={campaign.src}
        alt={campaign.name}
        width={18}
        height={18}
        className="rounded-full w-[18px] h-[18px] object-contain shrink-0"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-stone-800 font-semibold text-sm truncate leading-5 font-sans">{campaign.name}</p>
        <p className="text-stone-500 dark:text-stone-600 font-normal text-xs truncate font-sans leading-4">
          {campaign.domain}
        </p>
      </div>
    </div>
  );
}

export function MicroworksMultiCampaign() {
  const [campaigns, setCampaigns] = useState<CampaignItemData[]>(INITIAL_CAMPAIGNS);
  const unadded = AVAILABLE_CAMPAIGNS.filter((c) => !campaigns.some((item) => item.domain === c.domain));
  const activeCampaign = campaigns[0];
  const canAddMore = unadded.length > 0;

  const handleAddCampaign = () => {
    if (!canAddMore) return;
    const randomPick = unadded[Math.floor(Math.random() * unadded.length)];
    setCampaigns((prev) => [prev[0], randomPick, ...prev.slice(1)]);
  };

  return (
    <>
      {/* Multi-campaign Support */}
      <div id="campaigns" className="my-10 md:my-20 border border-stone-200">
        <div className="flex flex-col">
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-px bg-stone-200 [&>*:first-child]:order-last">
            {/* Visual Card Column */}
            <div className="relative w-full h-full md:h-130 overflow-hidden">
              <img
                src="/autosend/images/lake-beach.png"
                width={550}
                height={520}
                alt="multi campaign background"
                className="w-full h-full absolute top-0 shrink-0 object-cover"
              />
              <div className="relative z-10 w-full h-full">
                <div className="relative overflow-hidden h-full flex items-center justify-center">
                  <div className="flex h-full p-6 z-10 rounded-xl w-full items-center justify-center">
                    <div className="bg-stone-50 rounded-lg overflow-hidden flex flex-col w-full max-w-sm border border-stone-200 shadow-[0_8px_16px_rgba(33,33,33,0.06)]">
                      {/* Browser Mockup Top Bar */}
                      <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-2.5 border-b border-stone-200">
                        <span className="size-3 rounded-full bg-stone-200" />
                        <span className="size-3 rounded-full bg-stone-200" />
                        <span className="size-3 rounded-full bg-stone-200" />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4">
                        {/* Selector Header */}
                        <div className="w-64 flex items-center px-2 py-1.5 justify-between border border-stone-200 rounded-lg bg-stone-0">
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <img
                              src={activeCampaign.src}
                              alt={activeCampaign.name}
                              width={18}
                              height={18}
                              className="rounded-full w-[18px] h-[18px] object-contain"
                            />
                            <p className="text-stone-800 font-semibold text-sm flex-1 truncate font-sans">
                              {activeCampaign.name}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-stone-500 cursor-pointer box-border justify-center shrink-0 flex items-center justify-center font-semibold font-sans uppercase border border-transparent hover:bg-stone-100 transition-all ease-in duration-75 whitespace-nowrap text-center text-xs leading-4 rounded-lg w-6 py-1 h-6"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>

                        {/* Dropdown Container */}
                        <div className="w-64 rounded-lg border border-stone-200 p-2 flex flex-col shadow-xs bg-stone-0">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 pl-2">
                              <CampaignRow campaign={activeCampaign} />
                              <button
                                type="button"
                                className="cursor-pointer text-stone-500 hover:text-stone-800 transition-colors p-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                            <hr className="border-t border-stone-200 my-2 mr-2 ml-10" />

                            {/* Dynamic Campaigns with Framer Motion Animation */}
                            <div className="h-full overflow-y-auto max-h-40 flex flex-col gap-1 shrink-0">
                              <AnimatePresence initial={false}>
                                {campaigns.slice(1).map((item) => (
                                  <motion.div
                                    key={item.domain}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                                  >
                                    <div className="px-2 py-1">
                                      <CampaignRow campaign={item} />
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>

                            {/* Add Campaign Button */}
                            <button
                              type="button"
                              onClick={handleAddCampaign}
                              disabled={!canAddMore}
                              className="flex cursor-pointer rounded-lg items-center gap-3.5 w-full pl-2 py-2 hover:bg-stone-100 transition-colors duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="text-stone-800 font-semibold text-xs uppercase tracking-uppercase font-sans">
                                {canAddMore ? "New Campaign" : "All Campaigns Added"}
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Column */}
            <div className="bg-stone-50 flex flex-col justify-between px-4 gap-6 py-6 md:px-6">
              <p className="text-blue-600 font-medium text-sm uppercase font-sans leading-4">Multi campaign support</p>
              <div className="flex flex-col gap-4 md:gap-6">
                <h2 className="font-sans text-[32px] md:text-[40px] leading-120 -tracking-[2%]">Multiple Campaigns, Unified Settlement.</h2>
                <p className="text-stone-500 text-base md:text-xl leading-7">
                  Create isolated campaigns for every dataset, client, or agentic loop you manage—each with its own consensus quorum, bounty vault, and worker qualification filters.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="bg-stone-50 flex flex-col justify-between px-4 gap-6 py-6 md:px-6">
              <p className="text-blue-600 font-medium text-sm uppercase font-sans leading-4">Multi campaign support</p>
              <div className="flex flex-col gap-4 md:gap-6">
                <h2 className="font-sans text-[32px] md:text-[40px] leading-120 -tracking-[2%]">Multiple Campaigns, Unified Settlement.</h2>
                <p className="text-stone-500 text-base md:text-xl leading-7">
                  Create isolated campaigns for every dataset, client, or agentic loop you manage—each with its own consensus quorum, bounty vault, and worker qualification filters.
                </p>
              </div>
            </div>
            <div className="relative w-full h-full overflow-hidden p-6 bg-stone-100">
              <img
                src="/autosend/images/multi-project-support-mobile-light.png"
                alt="multi campaign mobile"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agentic Integrations */}
      <div id="integrations" className="my-10 md:my-20 border-x border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-y border-stone-200">
          <div className="flex flex-col gap-2 md:gap-4 justify-between px-4 md:px-6 py-6 lg:border-r border-stone-200 border-b lg:border-b-0">
            <p className="text-blue-600 font-medium text-sm font-sans uppercase leading-4">Agentic Integrations</p>
            <p className="font-sans text-[32px] md:text-[40px] leading-120 font-normal">
              Works with your <br />
              favorite agent.
            </p>
          </div>

          <ul className="grid grid-cols-2">
            {logos.map((item, idx) => (
              <li
                key={item.label}
                className={[
                  "odd:border-r h-full border-b border-stone-200",
                  logos.length - idx <= 2 ? "[&:nth-last-child(-n+2)]:border-b-0" : "",
                ].join(" ")}
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between p-4 md:p-6 group gap-4 h-full hover:bg-stone-100 transition-colors ease duration-100"
                  href={item.href}
                >
                  <div className="flex flex-col justify-between gap-4">
                    <span
                      className={`${
                        item.label === "Claude" ? "text-[#D97757]" : "text-black dark:text-white"
                      } w-6 h-6 shrink-0`}
                      dangerouslySetInnerHTML={{ __html: item.svg }}
                    />
                    <p className="text-stone-800 font-medium text-sm font-sans uppercase">{item.label}</p>
                  </div>
                  <span className="text-stone-500 group-hover:text-stone-800 transition-colors ease duration-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
