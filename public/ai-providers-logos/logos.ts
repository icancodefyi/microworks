import React from 'react'

export type LogoItem = {
  id: string;
  label: string;
  href: string;
  svg: string;
  textColor?: string;
  bgLight?: string;
  borderLight?: string;
};

export const logos: LogoItem[] = [
  {
    id: "cursor",
    label: "Cursor",
    href: "https://docs.autosend.com/ai/mcp-clients/cursor",
    textColor: "text-stone-900",
    bgLight: "bg-purple-50",
    borderLight: "border-purple-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M20.632 5.679 11.026.134a1 1 0 0 0-.998 0L.419 5.679A.84.84 0 0 0 0 6.405V17.59c0 .3.16.577.42.727l9.607 5.547a1 1 0 0 0 .998 0l9.608-5.547a.84.84 0 0 0 .42-.727V6.406a.84.84 0 0 0-.42-.726zm-.603 1.176-9.275 16.064c-.063.108-.228.064-.228-.061v-10.52a.59.59 0 0 0-.295-.51l-9.11-5.26c-.107-.061-.063-.227.062-.227h18.55c.264 0 .428.286.296.514" clip-rule="evenodd"></path></svg>',
  },
  {
    id: "claude",
    label: "Claude",
    href: "https://docs.autosend.com/ai/mcp-clients/claude",
    textColor: "text-[#D97757]",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><g><path fill="currentColor" d="m4.715 15.956 4.717-2.648.079-.23-.079-.128h-.23l-.79-.048-2.696-.073-2.337-.097-2.265-.122-.57-.121-.535-.705.055-.352.48-.322.686.061 1.517.104 2.277.157 1.652.098 2.446.255h.389l.055-.158-.134-.098-.103-.097-2.356-1.596-2.55-1.688-1.335-.972-.723-.492-.364-.46-.158-1.009.656-.722.88.06.225.061.892.686 1.906 1.476 2.49 1.833.364.304.146-.104.018-.072-.164-.274-1.354-2.446-1.445-2.49-.643-1.032-.17-.619a3 3 0 0 1-.104-.728L6.287.133 6.7 0l.996.134.419.364.619 1.415L9.736 4.14l1.554 3.03.455.898.243.832.091.255h.158V9.01l.127-1.706.237-2.095.231-2.695.079-.76.376-.91.747-.492.583.28.48.685-.067.444-.285 1.851-.56 2.903-.363 1.942h.212l.243-.243.984-1.305 1.65-2.064.73-.82.85-.904.546-.431h1.032l.759 1.129-.34 1.166-1.062 1.347-.88 1.142-1.264 1.7-.789 1.36.073.11.188-.02 2.854-.606 1.542-.28 1.84-.315.831.388.091.395-.328.807-1.967.486-2.307.461-3.436.814-.043.03.049.061 1.548.146.662.036h1.62l3.018.225.79.522.473.638-.079.485-1.214.62-1.64-.389-3.824-.91-1.312-.329h-.182v.11l1.093 1.068 2.004 1.81 2.507 2.33.127.578-.321.455-.34-.049-2.204-1.657-.85-.747-1.925-1.62h-.127v.17l.443.649 2.344 3.521.12 1.08-.17.353-.606.212-.668-.12-1.372-1.925-1.415-2.168-1.141-1.943-.14.08-.674 7.254-.316.37-.728.28-.607-.461-.322-.747.322-1.476.388-1.924.316-1.53.285-1.9.17-.632-.012-.042-.14.018-1.432 1.967-2.18 2.945-1.724 1.845-.413.164-.716-.37.066-.662.401-.589L8.17 17.57l1.44-1.882.928-1.086-.006-.158h-.055L4.138 18.56l-1.13.146-.485-.456.06-.746.231-.243 1.907-1.312z"></path></g></svg>',
  },
  {
    id: "windsurf",
    label: "Windsurf",
    href: "https://codeium.com/windsurf",
    textColor: "text-teal-700",
    bgLight: "bg-teal-50",
    borderLight: "border-teal-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.578 0.422 L12 12 L23.578 23.578 C23.839 23.318 24 22.958 24 22.56 V1.44 C24 1.042 23.839 0.682 23.578 0.422 Z" fill="#60D5C4"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M23.578 0.422 L12 12 L0.422 0.422 C0.682 0.161 1.042 0 1.44 0 H22.56 C22.958 0 23.318 0.161 23.578 0.422 Z" fill="#71E9D8"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0.422 0.422 L12 12 L0.422 23.578 C0.161 23.318 0 22.958 0 22.56 V1.44 C0 1.042 0.161 0.682 0.422 0.422 Z" fill="#60D5C4"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M23.578 23.578 L12 12 L0.422 23.578 C0.682 23.839 1.042 24 1.44 24 H22.56 C22.958 24 23.318 23.839 23.578 23.578 Z" fill="#71E9D8"></path></svg>',
  },
  {
    id: "copilot",
    label: "Copilot",
    href: "https://docs.autosend.com/ai/mcp-clients/copilot",
    textColor: "text-stone-900",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-200",
    svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M19.245 5.364C20.567 6.724 21.122 8.58 21.355 11.181C21.977 11.181 22.555 11.316 22.947 11.835L23.677 12.799C23.887 13.077 24 13.409 24 13.754V16.374C24 16.713 23.827 17.043 23.547 17.242C20.239 19.602 16.157 21.5 12 21.5C7.4 21.5 2.795 18.917 0.453 17.242C0.173 17.042 0.001 16.712 0 16.374V13.754C0 13.409 0.113 13.075 0.321 12.798L1.051 11.835C1.443 11.318 2.025 11.181 2.644 11.181L2.673 10.884C2.923 8.438 3.483 6.671 4.755 5.364C7.216 2.824 10.465 2.513 11.901 2.5H12.099C13.535 2.513 16.784 2.823 19.245 5.364ZM12.001 9.692C11.717 9.692 11.388 9.708 11.039 9.742C10.916 10.189 10.734 10.592 10.469 10.85C9.419 11.873 8.153 12.03 7.475 12.03C6.837 12.03 6.169 11.9 5.624 11.566C5.108 11.731 4.612 11.969 4.58 12.562C4.53795 13.5228 4.51695 14.4843 4.517 15.446L4.515 15.926C4.513 16.489 4.51 17.052 4.502 17.616C4.504 17.942 4.706 18.246 5.012 18.381C7.494 19.483 9.842 20.038 12.002 20.038C14.158 20.038 16.506 19.483 18.987 18.381C19.1363 18.3153 19.2636 18.2083 19.354 18.0726C19.4444 17.9368 19.494 17.778 19.497 17.615C19.527 15.933 19.503 14.243 19.421 12.562C19.39 11.966 18.893 11.732 18.375 11.566C17.829 11.899 17.163 12.03 16.525 12.03C15.848 12.03 14.583 11.873 13.532 10.85C13.266 10.592 13.085 10.189 12.962 9.742C12.642 9.71 12.321 9.693 12.001 9.692ZM9.476 13.705C10.015 13.705 10.452 14.131 10.452 14.655V16.408C10.452 16.933 10.015 17.358 9.476 17.358C9.22067 17.3612 8.97449 17.263 8.79151 17.0849C8.60853 16.9068 8.50369 16.6633 8.5 16.408V14.656C8.5 14.131 8.937 13.705 9.476 13.705ZM14.476 13.705C15.015 13.705 15.452 14.131 15.452 14.655V16.408C15.452 16.933 15.015 17.358 14.476 17.358C14.2207 17.3612 13.9745 17.263 13.7915 17.0849C13.6085 16.9068 13.5037 16.6633 13.5 16.408V14.656C13.5 14.131 13.937 13.705 14.476 13.705ZM7.635 5.087C6.585 5.189 5.7 5.525 5.25 5.993C4.275 7.03 4.485 9.661 5.04 10.217C5.445 10.611 6.21 10.874 7.035 10.874H7.125C7.774 10.861 8.91 10.698 9.855 9.764C10.29 9.354 10.56 8.331 10.53 7.294C10.5 6.46 10.26 5.774 9.9 5.481C9.51 5.145 8.625 4.999 7.635 5.087ZM14.1 5.481C13.74 5.773 13.5 6.461 13.47 7.294C13.44 8.331 13.71 9.354 14.145 9.764C15.113 10.721 16.281 10.868 16.921 10.874H16.965C17.79 10.874 18.555 10.611 18.96 10.217C19.515 9.661 19.725 7.03 18.75 5.993C18.3 5.525 17.415 5.189 16.365 5.087C15.375 4.999 14.49 5.145 14.1 5.481ZM12 7.615C11.76 7.615 11.475 7.63 11.16 7.659C11.19 7.819 11.205 7.995 11.22 8.185L11.219 8.344C11.2179 8.42749 11.2132 8.5109 11.205 8.594C11.43 8.572 11.63 8.567 11.817 8.566H12.183C12.37 8.566 12.57 8.572 12.795 8.594C12.78 8.448 12.78 8.317 12.78 8.185C12.795 7.995 12.81 7.82 12.84 7.659C12.5608 7.63166 12.2805 7.61698 12 7.615Z" fill="currentColor"></path></g></svg>',
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    href: "https://docs.autosend.com/ai/mcp-clients/chatgpt",
    textColor: "text-emerald-700",
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9.67 9.304V7.421c0-.158.06-.277.2-.357l3.785-2.18c.516-.297 1.13-.436 1.764-.436 2.379 0 3.885 1.844 3.885 3.806 0 .138 0 .297-.02.456l-3.924-2.3a.66.66 0 0 0-.714 0zm8.841 7.334v-4.5a.66.66 0 0 0-.357-.614L13.18 8.63l1.626-.931a.36.36 0 0 1 .396 0l3.786 2.18c1.09.634 1.824 1.982 1.824 3.29 0 1.507-.892 2.894-2.3 3.47m-10.01-3.964-1.625-.951c-.139-.08-.198-.199-.198-.357v-4.36c0-2.122 1.625-3.727 3.826-3.727a3.7 3.7 0 0 1 2.26.773l-3.906 2.26a.66.66 0 0 0-.356.614zM12 14.696l-2.33-1.308v-2.775L12 9.304l2.329 1.309v2.775zm1.496 6.026a3.7 3.7 0 0 1-2.26-.774l3.906-2.26a.66.66 0 0 0 .356-.614v-5.748l1.646.951c.138.08.198.199.198.357v4.36c0 2.122-1.645 3.728-3.845 3.728M8.8 16.302 5.013 14.12c-1.09-.634-1.824-1.982-1.824-3.29 0-1.527.912-2.894 2.32-3.47v4.52c0 .278.118.476.356.615l4.955 2.874-1.625.931a.36.36 0 0 1-.396 0m-.218 3.25c-2.24 0-3.885-1.685-3.885-3.766 0-.159.02-.317.04-.476l3.904 2.26a.66.66 0 0 0 .714 0l4.975-2.874v1.883c0 .159-.06.278-.198.357l-3.786 2.18c-.516.297-1.13.436-1.764.436m4.916 2.359c2.398 0 4.4-1.705 4.856-3.965C20.573 17.372 22 15.29 22 13.17a5.01 5.01 0 0 0-1.665-3.706c.1-.416.159-.833.159-1.249 0-2.834-2.3-4.955-4.956-4.955-.535 0-1.05.079-1.566.257a4.97 4.97 0 0 0-3.468-1.427 4.956 4.956 0 0 0-4.857 3.965C3.427 6.628 2 8.71 2 10.83c0 1.387.595 2.735 1.665 3.706a5.4 5.4 0 0 0-.159 1.249c0 2.834 2.3 4.955 4.956 4.955.535 0 1.05-.079 1.566-.257a4.97 4.97 0 0 0 3.468 1.427"></path></svg>',
  },
  {
    id: "codex",
    label: "Codex",
    href: "https://docs.autosend.com/ai/mcp-clients/codex",
    textColor: "text-indigo-700",
    bgLight: "bg-indigo-50",
    borderLight: "border-indigo-200",
    svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><g><path d="M8.08513 0.4591C9.04855 0.0627266 10.0974 -0.080481 11.1318 0.0431097C12.4652 0.19644 13.6532 0.763094 14.6958 1.74307C14.7092 1.7564 14.7278 1.76574 14.7452 1.77107C14.764 1.7757 14.7837 1.7757 14.8025 1.77107C16.158 1.42102 17.5929 1.55057 18.8639 2.13773L18.9265 2.16706L19.0812 2.24306C20.4116 2.91732 21.4492 4.05504 21.9985 5.44165C22.2772 6.12164 22.4159 6.82962 22.4185 7.56827C22.4386 8.11761 22.3784 8.66694 22.2399 9.1989C22.233 9.22576 22.2331 9.25391 22.2401 9.28072C22.2471 9.30753 22.2608 9.33214 22.2799 9.35223C23.0719 10.1615 23.5972 11.1255 23.8572 12.2455C24.2425 14.1455 23.8479 15.8588 22.6745 17.3841L22.4932 17.6054C21.7161 18.4949 20.6961 19.1381 19.5585 19.456C19.5338 19.4632 19.5112 19.4762 19.4924 19.4938C19.4737 19.5114 19.4593 19.5332 19.4505 19.5573C19.1959 20.292 18.9399 20.9213 18.4638 21.5493C17.2638 23.1319 15.5012 24.0106 13.5158 23.9999C11.9331 23.9919 10.5305 23.4133 9.30647 22.2639C9.28805 22.2467 9.26538 22.2347 9.24079 22.229C9.21619 22.2234 9.19055 22.2244 9.16647 22.2319C8.64913 22.3986 8.12646 22.4226 7.56113 22.4159C6.66068 22.4087 5.77374 22.1962 4.96778 21.7946C4.12355 21.3763 3.38852 20.7668 2.8211 20.0147C2.61843 19.7453 2.4171 19.492 2.2691 19.192C2.06705 18.7804 1.90196 18.3516 1.77576 17.9107C1.50936 16.9076 1.50294 15.8531 1.7571 14.8468C1.76545 14.8228 1.76819 14.7973 1.7651 14.7721C1.76053 14.7474 1.74787 14.7249 1.7291 14.7081C1.11318 14.0847 0.642434 13.3331 0.350422 12.5068C0.156222 11.9979 0.0432862 11.4616 0.0157542 10.9175C-0.0326849 10.201 0.0307418 9.48127 0.203755 8.78425C0.653091 7.30161 1.5131 6.13764 2.7811 5.29366C3.06377 5.10566 3.33177 4.959 3.58244 4.85367C3.86911 4.735 4.15578 4.63501 4.44378 4.55101C4.46436 4.54462 4.48304 4.53325 4.49816 4.5179C4.51329 4.50254 4.52437 4.48369 4.53044 4.46301C4.74913 3.67775 5.12519 2.94515 5.63578 2.30973C6.27943 1.49242 7.12307 0.855004 8.08513 0.4591ZM12.7278 14.5455C12.5111 14.5576 12.3073 14.6522 12.1582 14.8099C12.0091 14.9676 11.9261 15.1764 11.9261 15.3934C11.9261 15.6104 12.0091 15.8192 12.1582 15.9769C12.3073 16.1346 12.5111 16.2293 12.7278 16.2414H17.5758C17.6912 16.2479 17.8067 16.2307 17.9152 16.1911C18.0237 16.1514 18.123 16.09 18.2069 16.0106C18.2909 15.9312 18.3578 15.8355 18.4035 15.7294C18.4492 15.6233 18.4728 15.509 18.4728 15.3934C18.4728 15.2779 18.4492 15.1636 18.4035 15.0575C18.3578 14.9513 18.2909 14.8557 18.2069 14.7763C18.123 14.6969 18.0237 14.6355 17.9152 14.5958C17.8067 14.5561 17.6912 14.539 17.5758 14.5455H12.7278ZM7.28246 8.30692C7.16707 8.119 6.98311 7.98331 6.76949 7.92857C6.55586 7.87383 6.32932 7.90433 6.13777 8.01361C5.94622 8.12289 5.80469 8.30238 5.74311 8.51413C5.68153 8.72588 5.70472 8.95328 5.80778 9.14824L7.50379 12.1135L5.81578 14.9614C5.75896 15.0573 5.72158 15.1634 5.70578 15.2737C5.68997 15.384 5.69604 15.4964 5.72365 15.6043C5.75126 15.7123 5.79987 15.8138 5.86669 15.9029C5.93352 15.9921 6.01725 16.0673 6.11312 16.1241C6.20898 16.1809 6.3151 16.2183 6.42541 16.2341C6.53573 16.2499 6.64807 16.2438 6.75603 16.2162C6.864 16.1886 6.96547 16.14 7.05465 16.0732C7.14383 16.0064 7.21897 15.9226 7.27579 15.8268L9.21447 12.5535C9.2909 12.4245 9.33179 12.2776 9.33296 12.1277C9.33413 11.9778 9.29555 11.8303 9.22114 11.7002L7.28246 8.30692Z" fill="url(#paint0_linear_2079_389)"></path></g></g><defs><linearGradient id="paint0_linear_2079_389" x1="11.9998" y1="0.000443983" x2="11.9998" y2="23.9999" gradientUnits="userSpaceOnUse"><stop stop-color="#B1A7FF"></stop><stop offset="0.5" stop-color="#7A9DFF"></stop><stop offset="1" stop-color="#3941FF"></stop></linearGradient></defs></svg>',
  },
  {
    id: "antigravity",
    label: "Antigravity",
    href: "https://docs.autosend.com/ai/mcp-clients/antigravity",
    textColor: "text-stone-900",
    bgLight: "bg-yellow-50",
    borderLight: "border-yellow-200",
    svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_2079_391" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="1" width="24" height="23"><path d="M21.7509 22.607C23.0909 23.612 25.1009 22.942 23.2589 21.099C17.7299 15.74 18.9039 1 12.0369 1C5.16985 1 6.34185 15.74 0.814855 21.1C-1.19515 23.109 0.981855 23.611 2.32185 22.606C7.51385 19.089 7.17885 12.892 12.0369 12.892C16.8939 12.892 16.5589 19.089 21.7509 22.607Z" fill="white"></path></mask><g mask="url(#mask0_2079_391)"><g filter="url(#filter0_f_2079_391)"><path d="M-1.01807 -3.99199C-1.42607 -0.400986 1.66793 2.89801 5.89193 3.37801C10.1169 3.85801 13.8719 1.33501 14.2789 -2.25499C14.6869 -5.84499 11.5929 -9.14499 7.36893 -9.62499C3.14393 -10.104 -0.611065 -7.58199 -1.01807 -3.99199Z" fill="#FFE432"></path></g><g filter="url(#filter1_f_2079_391)"><path d="M15.2689 7.74703C16.3269 12.304 20.9599 15.121 25.6169 14.04C30.2739 12.958 33.1919 8.38703 32.1329 3.83003C31.0749 -0.725966 26.4419 -3.54397 21.7849 -2.46197C17.1279 -1.37997 14.2099 3.19103 15.2689 7.74803V7.74703Z" fill="#FC413D"></path></g><g filter="url(#filter2_f_2079_391)"><path d="M-12.4431 10.804C-11.1051 15.507 -5.08311 17.914 1.00989 16.182C7.10189 14.449 10.9569 9.23203 9.61989 4.53003C8.28189 -0.172967 2.25989 -2.57997 -3.83311 -0.847968C-9.92511 0.884032 -13.7801 6.10003 -12.4431 10.804Z" fill="#00B95C"></path></g><g filter="url(#filter3_f_2079_391)"><path d="M-12.4431 10.804C-11.1051 15.507 -5.08311 17.914 1.00989 16.182C7.10189 14.449 10.9569 9.23203 9.61989 4.53003C8.28189 -0.172967 2.25989 -2.57997 -3.83311 -0.847968C-9.92511 0.884032 -13.7801 6.10003 -12.4431 10.804Z" fill="#00B95C"></path></g><g filter="url(#filter4_f_2079_391)"><path d="M-7.60815 14.7031C-4.25615 18.1271 1.51785 17.9111 5.28785 14.2201C9.05785 10.5301 9.39585 4.76105 6.04385 1.33705C2.68985 -2.08695 -3.08315 -1.87095 -6.85315 1.82005C-10.6231 5.51005 -10.9611 11.2781 -7.60815 14.7031Z" fill="#00B95C"></path></g><g filter="url(#filter5_f_2079_391)"><path d="M9.932 27.617C10.972 32.099 15.316 34.92 19.632 33.917C23.948 32.915 26.603 28.469 25.562 23.987C24.522 19.504 20.178 16.683 15.862 17.686C11.546 18.688 8.891 23.134 9.932 27.616V27.617Z" fill="#3186FF"></path></g><g filter="url(#filter6_f_2079_391)"><path d="M2.57165 -8.18498C0.391653 -3.32898 2.77765 2.47202 7.89965 4.77102C13.0217 7.07102 18.9417 4.99802 21.1217 0.141024C23.3017 -4.71398 20.9167 -10.515 15.7947 -12.814C10.6727 -15.114 4.75265 -13.041 2.57265 -8.18398L2.57165 -8.18498Z" fill="#FBBC04"></path></g><g filter="url(#filter7_f_2079_391)"><path d="M-3.26701 38.686C-8.54401 36.614 0.474992 19.569 2.71699 13.856C4.95999 8.14403 11.057 5.19203 16.333 7.26403C21.611 9.33503 27.866 20.746 25.623 26.459C23.381 32.172 2.00999 40.757 -3.26701 38.686Z" fill="#3186FF"></path></g><g filter="url(#filter8_f_2079_391)"><path d="M28.7097 17.471C27.2967 19.12 23.6097 18.279 20.4737 15.593C17.3387 12.906 15.9427 9.39203 17.3557 7.74303C18.7677 6.09403 22.4557 6.93503 25.5907 9.62103C28.7257 12.307 30.1227 15.821 28.7097 17.471Z" fill="#749BFF"></path></g><g filter="url(#filter9_f_2079_391)"><path d="M18.1629 9.07705C23.9729 13.0071 30.6649 13.2671 33.1089 9.65405C35.552 6.04206 32.8219 -0.0729461 27.0109 -4.00395C21.2009 -7.93495 14.5089 -8.19395 12.0649 -4.58095C9.62195 -0.968946 12.3519 5.14605 18.1629 9.07705Z" fill="#FC413D"></path></g><g filter="url(#filter10_f_2079_391)"><path d="M-0.914879 2.684C-2.35488 6.157 -1.88488 9.651 0.135121 10.488C2.15512 11.325 4.95912 9.188 6.39912 5.716C7.83912 2.243 7.36912 -1.251 5.34912 -2.088C3.32912 -2.925 0.525121 -0.788002 -0.914879 2.684Z" fill="#FFEE48"></path></g></g><defs><filter id="filter0_f_2079_391" x="-2.1712" y="-10.8003" width="17.6031" height="15.3539" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="0.5585" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter1_f_2079_391" x="9.65176" y="-8.09324" width="28.0983" height="27.7642" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="2.7" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter2_f_2079_391" x="-17.299" y="-6.00073" width="31.7748" height="27.3355" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="2.2955" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter3_f_2079_391" x="-17.299" y="-6.00073" width="31.7748" height="27.3355" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="2.2955" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter4_f_2079_391" x="-14.5085" y="-5.68701" width="27.452" height="27.4141" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="2.2955" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter5_f_2079_391" x="5.34305" y="13.1205" width="24.808" height="25.362" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="2.1815" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter6_f_2079_391" x="-2.18984" y="-17.7064" width="28.073" height="27.3699" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1.977" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter7_f_2079_391" x="-8.42944" y="3.07075" width="38.0522" height="39.4619" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1.7655" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter8_f_2079_391" x="13.6452" y="3.73993" width="18.7745" height="17.7342" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1.5795" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter9_f_2079_391" x="8.50092" y="-9.79913" width="28.172" height="24.671" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1.3345" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter><filter id="filter10_f_2079_391" x="-5.05251" y="-5.57253" width="15.5894" height="19.5451" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1.6515" result="effect1_foregroundBlur_2079_391"></feGaussianBlur></filter></defs></svg>',
  },
  {
    id: "lovable",
    label: "Lovable",
    href: "https://docs.autosend.com/ai/integrations/lovable",
    textColor: "text-pink-700",
    bgLight: "bg-pink-50",
    borderLight: "border-pink-200",
    svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.082 0C10.992 0 14.163 3.179 14.163 7.1V9.8H16.52C20.43 9.8 23.602 12.978 23.602 16.9C23.602 20.823 20.432 24 16.52 24H0V7.1C0 3.18 3.17 0 7.082 0Z" fill="url(#paint0_radial_2079_400)"></path></g><defs><radialGradient id="paint0_radial_2079_400" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14 3) rotate(92.5448) scale(22.5222 30.484)"><stop offset="0.25" stop-color="#FE7B02"></stop><stop offset="0.433" stop-color="#FE4230"></stop><stop offset="0.548" stop-color="#FE529A"></stop><stop offset="0.654" stop-color="#DD67EE"></stop><stop offset="0.95" stop-color="#4B73FF"></stop></radialGradient></defs></svg>',
  },
  {
    id: "gemini",
    label: "Gemini",
    href: "https://gemini.google.com",
    textColor: "text-blue-600",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 32 32"><mask id="mask0_gemini_faq" width="24" height="24" x="4" y="4" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M16.092 4.928c.235 0 .439.16.496.388q.263 1.046.69 2.038a14.4 14.4 0 0 0 3.057 4.53 14.4 14.4 0 0 0 4.53 3.057q.993.428 2.038.69a.513.513 0 0 1 0 .993q-1.046.263-2.038.69a14.4 14.4 0 0 0-4.53 3.057 14.4 14.4 0 0 0-3.747 6.568.512.512 0 0 1-.993 0 14.374 14.374 0 0 0-3.746-6.569 14.4 14.4 0 0 0-4.53-3.056 13.4 13.4 0 0 0-2.04-.69.513.513 0 0 1 0-.993 14.385 14.385 0 0 0 6.569-3.746 14.4 14.4 0 0 0 3.747-6.569.51.51 0 0 1 .497-.388"/><path fill="url(#paint0_linear_gemini_faq)" d="M16.092 4.928c.235 0 .439.16.496.388q.263 1.046.69 2.038a14.4 14.4 0 0 0 3.057 4.53 14.4 14.4 0 0 0 4.53 3.057q.993.428 2.038.69a.513.513 0 0 1 0 .993q-1.046.263-2.038.69a14.4 14.4 0 0 0-4.53 3.057 14.4 14.4 0 0 0-3.747 6.568.512.512 0 0 1-.993 0 14.374 14.374 0 0 0-3.746-6.569 14.4 14.4 0 0 0-4.53-3.056 13.4 13.4 0 0 0-2.04-.69.513.513 0 0 1 0-.993 14.385 14.385 0 0 0 6.569-3.746 14.4 14.4 0 0 0 3.747-6.569.51.51 0 0 1 .497-.388"/></mask><g mask="url(#mask0_gemini_faq)"><g filter="url(#filter0_f_gemini_faq)"><path fill="#FFE432" d="M2.872 22.44c2.588.918 5.563-.805 6.644-3.85s-.14-6.259-2.728-7.178-5.563.804-6.644 3.85c-1.082 3.045.14 6.258 2.728 7.177"/></g><g filter="url(#filter1_f_gemini_faq)"><path fill="#FC413D" d="M14.362 12.402c3.556 0 6.438-2.946 6.438-6.58s-2.882-6.58-6.438-6.58-6.438 2.946-6.438 6.58 2.882 6.58 6.438 6.58"/></g><g filter="url(#filter2_f_gemini_faq)"><path fill="#00B95C" d="M11.86 33.443c3.713-.181 6.531-4.226 6.296-9.034s-3.435-8.56-7.146-8.378c-3.712.181-6.53 4.226-6.295 9.035.235 4.808 3.434 8.559 7.146 8.377"/></g><g filter="url(#filter3_f_gemini_faq)"><path fill="#00B95C" d="M11.86 33.443c3.713-.181 6.531-4.226 6.296-9.034s-3.435-8.56-7.146-8.378c-3.712.181-6.53 4.226-6.295 9.035.235 4.808 3.434 8.559 7.146 8.377"/></g><g filter="url(#filter4_f_gemini_faq)"><path fill="#00B95C" d="M15.578 30.534c3.111-1.893 3.944-6.205 1.86-9.63s-6.297-4.669-9.408-2.775c-3.112 1.893-3.945 6.205-1.86 9.63s6.296 4.668 9.408 2.775"/></g><g filter="url(#filter5_f_gemini_faq)"><path fill="#3186FF" d="M30.648 13.914c1.196 3.513-.746 7.42-4.338 8.727s-7.46-.749-8.656-4.262.746-7.42 4.338-8.727 7.46.75 8.656 4.262"/></g><g filter="url(#filter6_f_gemini_faq)"><path fill="#FBBC04" d="M18.841-4.14c-2.254-2.43-7.25-1.46-11.16 2.166S2.43 5.562 4.684 7.992s7.25 1.46 11.16-2.166 5.251-7.536 2.997-9.966"/></g><g filter="url(#filter7_f_gemini_faq)"><path fill="#3186FF" d="M14.542 36.31c-3.824-3.059.345-15.65 1.97-19.882 1.625-4.232 6.044-6.42 9.868-3.36 3.824 3.059 8.358 11.513 6.733 15.745-1.625 4.232-14.747 10.556-18.571 7.497"/></g><g filter="url(#filter8_f_gemini_faq)"><path fill="#749BFF" d="M37.747 20.73c-1.024 1.222-3.696.6-5.969-1.39-2.272-1.99-3.284-4.594-2.26-5.816 1.024-1.222 3.696-.6 5.969 1.39 2.272 1.99 3.284 4.594 2.26 5.816"/></g><g filter="url(#filter9_f_gemini_faq)"><path fill="#FC413D" d="M15.844 10.487C19.754 6.86 21.096 1.95 18.841-.48c-2.254-2.43-7.25-1.46-11.16 2.166S2.43 10.222 4.684 12.652s7.25 1.46 11.16-2.165"/></g><g filter="url(#filter10_f_gemini_faq)"><path fill="#FFEE48" d="M7.83 23.512c2.324 1.663 4.992 1.916 5.96.564.966-1.35-.133-3.794-2.457-5.457s-4.991-1.916-5.958-.565.132 3.795 2.456 5.458"/></g></g><defs><filter id="filter0_f_gemini_faq" width="13.556" height="14.918" x="-1.948" y="9.468" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="0.849"/></filter><filter id="filter1_f_gemini_faq" width="29.294" height="29.578" x="-0.285" y="-8.967" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="4.105"/></filter><filter id="filter2_f_gemini_faq" width="27.426" height="31.381" x="-2.277" y="9.047" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="3.489"/></filter><filter id="filter3_f_gemini_faq" width="27.426" height="31.381" x="-2.277" y="9.047" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="3.489"/></filter><filter id="filter4_f_gemini_faq" width="27.521" height="28.135" x="-1.957" y="10.264" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="3.489"/></filter><filter id="filter5_f_gemini_faq" width="25.928" height="25.46" x="15.19" y="0.941" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="3.316"/></filter><filter id="filter6_f_gemini_faq" width="26.971" height="27.184" x="-8.425" y="-0.682" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="3.005"/></filter><filter id="filter7_f_gemini_faq" width="27.226" height="26.764" x="7.691" y="2.867" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="2.684"/></filter><filter id="filter8_f_gemini_faq" width="19.424" height="17.883" x="9.582" y="-1.455" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="2.401"/></filter><filter id="filter9_f_gemini_faq" width="24.459" height="23.922" x="-0.467" y="-5.875" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="2.028"/></filter><filter id="filter10_f_gemini_faq" width="19.158" height="17.801" x="0.003" y="12.165" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_gemini" stdDeviation="2.51"/></filter><linearGradient id="paint0_linear_gemini_faq" x1="11.259" x2="22.893" y1="19.915" y2="10.107" gradientUnits="userSpaceOnUse"><stop stop-color="#4893FC"/><stop offset="0.27" stop-color="#4893FC"/><stop offset="0.777" stop-color="#969DFF"/><stop offset="1" stop-color="#BD99FE"/></linearGradient></defs></svg>',
  },
  {
    id: "perplexity",
    label: "Perplexity",
    href: "https://perplexity.ai",
    textColor: "text-[#22B8CD]",
    bgLight: "bg-teal-50",
    borderLight: "border-teal-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M22.398 7.09h-2.31V.068l-7.51 6.354V.158h-1.155v6.196L4.49 0v7.09H1.603v10.397H4.49V24l6.932-6.36v6.201h1.155v-6.047l6.932 6.181v-6.488h2.888zm-3.466-4.531v4.53h-5.355zm-13.286.067 4.87 4.464h-4.87zM2.758 16.332V8.245h7.847L4.491 14.36v1.972zm2.888 5.04v-6.534l5.776-5.776v7.011zm12.709.025-5.777-5.15V9.061l5.777 5.776zm2.888-5.065H19.51V14.36l-6.115-6.115h7.848z"/></svg>',
  },
  {
    id: "opencode",
    label: "OpenCode",
    href: "https://github.com/opencode-ai",
    textColor: "text-indigo-700",
    bgLight: "bg-indigo-50",
    borderLight: "border-indigo-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#4F46E5"/><path d="M7 8.5L11 12L7 15.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 16H17" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/></svg>',
  },
  {
    id: "node",
    label: "Node.js",
    href: "https://nodejs.org",
    textColor: "text-emerald-800",
    bgLight: "bg-emerald-50/70",
    borderLight: "border-emerald-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2.5 7.5V16.5L12 22L21.5 16.5V7.5L12 2Z" fill="#539E43"/><path d="M12 4.4L4.2 8.9V15.1L12 19.6L19.8 15.1V8.9L12 4.4Z" fill="#333333"/><path d="M12 7.2L6.8 10.2V13.8L12 16.8L17.2 13.8V10.2L12 7.2Z" fill="#539E43"/></svg>',
  },
  {
    id: "dashboard",
    label: "Dashboard Test",
    href: "/dashboard/mcp-test",
    textColor: "text-indigo-800",
    bgLight: "bg-indigo-50",
    borderLight: "border-indigo-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#4338CA"/><path d="M12 6L13.5 10.5L18 12L13.5 13.5L12 18L10.5 13.5L6 12L10.5 10.5L12 6Z" fill="#FDE047"/></svg>',
  },
  {
    id: "others",
    label: "Others",
    href: "https://docs.autosend.com/ai/mcp-server",
    textColor: "text-stone-700",
    bgLight: "bg-stone-100",
    borderLight: "border-stone-200",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  },
];

export const AI_PROVIDER_LOGOS: Record<string, LogoItem> = {
  cursor: logos.find((l) => l.id === "cursor")!,
  claude: logos.find((l) => l.id === "claude")!,
  "claude-code": {
    ...logos.find((l) => l.id === "claude")!,
    id: "claude-code",
    label: "Claude Code",
    href: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code",
  },
  windsurf: logos.find((l) => l.id === "windsurf")!,
  copilot: logos.find((l) => l.id === "copilot")!,
  chatgpt: logos.find((l) => l.id === "chatgpt")!,
  openai: logos.find((l) => l.id === "chatgpt")!,
  codex: logos.find((l) => l.id === "codex")!,
  antigravity: logos.find((l) => l.id === "antigravity")!,
  lovable: logos.find((l) => l.id === "lovable")!,
  gemini: logos.find((l) => l.id === "gemini")!,
  perplexity: logos.find((l) => l.id === "perplexity")!,
  opencode: logos.find((l) => l.id === "opencode")!,
  node: logos.find((l) => l.id === "node")!,
  "node.js": logos.find((l) => l.id === "node")!,
  dashboard: logos.find((l) => l.id === "dashboard")!,
  others: logos.find((l) => l.id === "others")!,
};

/**
 * Universal lookup for any AI agent or client name.
 * Handles casing, aliases, and fuzzy matches cleanly.
 */
export function getAiProviderLogo(rawName: string): LogoItem {
  const n = (rawName || "").toLowerCase().trim();

  if (n.includes("cursor")) return AI_PROVIDER_LOGOS.cursor;
  if (n.includes("claude-code") || n.includes("claude code")) return AI_PROVIDER_LOGOS["claude-code"];
  if (n.includes("claude")) return AI_PROVIDER_LOGOS.claude;
  if (n.includes("windsurf") || n.includes("codeium")) return AI_PROVIDER_LOGOS.windsurf;
  if (n.includes("copilot") || n.includes("github")) return AI_PROVIDER_LOGOS.copilot;
  if (n.includes("gemini")) return AI_PROVIDER_LOGOS.gemini;
  if (n.includes("perplexity")) return AI_PROVIDER_LOGOS.perplexity;
  if (n.includes("opencode")) return AI_PROVIDER_LOGOS.opencode;
  if (n.includes("chatgpt") || n.includes("openai")) return AI_PROVIDER_LOGOS.chatgpt;
  if (n.includes("codex")) return AI_PROVIDER_LOGOS.codex;
  if (n.includes("antigravity")) return AI_PROVIDER_LOGOS.antigravity;
  if (n.includes("lovable")) return AI_PROVIDER_LOGOS.lovable;
  if (n.includes("node")) return AI_PROVIDER_LOGOS.node;
  if (n.includes("dashboard")) return AI_PROVIDER_LOGOS.dashboard;

  return {
    ...AI_PROVIDER_LOGOS.others,
    label: rawName || "AI Agent",
  };
}
