import { useEffect, useMemo, useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const methodStyles = {
  GET: {
    dark: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  POST: {
    dark: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    light: "bg-blue-50 text-blue-700 border-blue-200",
  },
  PUT: {
    dark: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    light: "bg-amber-50 text-amber-700 border-amber-200",
  },
  PATCH: {
    dark: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    light: "bg-purple-50 text-purple-700 border-purple-200",
  },
  DELETE: {
    dark: "bg-red-500/10 text-red-400 border-red-500/20",
    light: "bg-red-50 text-red-700 border-red-200",
  },
};
function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("apilens-theme") || "dark";
  });
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState(
    `{ "Content-Type": "application/json" }`,
  );
  const [body, setBody] = useState(`{ "name": "Aryan" }`);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("body");
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";
  useEffect(() => {
    localStorage.setItem("apilens-theme", theme);
  }, [theme]);
  const responseLines = useMemo(() => {
    if (!response?.data) return 0;
    return JSON.stringify(response.data, null, 2).split("\n").length;
  }, [response]);
  const sendRequest = async () => {
    if (!url.trim()) {
      setError("Please enter an API URL.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setResponse(null);
      setCopied(false);
      let parsedHeaders = {};
      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers);
      }
      let parsedBody;
      if (body.trim() && method !== "GET" && method !== "DELETE") {
        parsedBody = JSON.parse(body);
      }
      const result = await axios.post(`${API_BASE_URL}/api/request`, {
        method,
        url,
        headers: parsedHeaders,
        body: parsedBody,
      });
      setResponse(result.data);
      setHistory((prev) =>
        [
          {
            id: Date.now(),
            method,
            url,
            status: result.data.status,
            responseTime: result.data.responseTime,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ].slice(0, 10),
      );
    } catch (err) {
      console.error(err);
      let message = "Something went wrong.";
      if (err instanceof SyntaxError) {
        message = "Invalid JSON in headers or request body.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
      setResponse({
        status: "ERROR",
        statusText: "Request Failed",
        responseTime: 0,
        headers: {},
        data: { message },
      });
    } finally {
      setLoading(false);
    }
  };
  const clearAll = () => {
    setUrl("");
    setResponse(null);
    setError("");
    setHistory([]);
    setCopied(false);
  };
  const copyResponse = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };
  const loadHistoryItem = (item) => {
    setMethod(item.method);
    setUrl(item.url);
  };
  const isSuccess =
    response &&
    typeof response.status === "number" &&
    response.status >= 200 &&
    response.status < 300;
  const themeClasses = {
    page: isDark ? "bg-[#070b14] text-white" : "bg-slate-50 text-slate-900",
    header: isDark
      ? "border-white/10 bg-slate-950/80"
      : "border-slate-200 bg-white/90",
    card: isDark
      ? "border-white/10 bg-white/[0.035]"
      : "border-slate-200 bg-white",
    input: isDark
      ? "border-white/10 bg-[#050810] text-slate-200 placeholder:text-slate-600"
      : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400",
    editor: isDark
      ? "border-white/10 bg-[#050810] text-slate-300"
      : "border-slate-200 bg-slate-100 text-slate-700",
    secondaryText: isDark ? "text-slate-500" : "text-slate-500",
    mutedText: isDark ? "text-slate-600" : "text-slate-400",
    border: isDark ? "border-white/10" : "border-slate-200",
    divider: isDark ? "border-white/10" : "border-slate-200",
    responseText: isDark ? "text-slate-300" : "text-slate-700",
    historyItem: isDark
      ? "border-white/5 bg-black/10 hover:border-blue-500/20 hover:bg-blue-500/[0.03]"
      : "border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-blue-50",
    stat: isDark
      ? "border-white/10 bg-white/[0.03]"
      : "border-slate-200 bg-white",
    about: isDark
      ? "border-white/10 bg-white/[0.025]"
      : "border-slate-200 bg-white",
    footer: isDark
      ? "border-white/5 text-slate-700"
      : "border-slate-200 text-slate-400",
  };
  return (
    <div
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${themeClasses.page}`}
    >
      {" "}
      {/* Background Glow */}{" "}
      <div className="pointer-events-none fixed inset-0">
        {" "}
        <div
          className={`absolute -left-40 -top-40 h-96 w-96 rounded-full blur-3xl ${isDark ? "bg-blue-600/10" : "bg-blue-400/10"}`}
        />{" "}
        <div
          className={`absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl ${isDark ? "bg-purple-600/10" : "bg-purple-400/10"}`}
        />{" "}
      </div>{" "}
      {/* Header */}{" "}
      <header
        className={`relative border-b backdrop-blur-xl transition-colors duration-300 ${themeClasses.header}`}
      >
        {" "}
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-5 sm:px-6">
          {" "}
          {/* Logo */}{" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 font-bold shadow-lg shadow-blue-500/20">
              {" "}
              A{" "}
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-emerald-400 ring-4 ring-blue-950" />{" "}
            </div>{" "}
            <div>
              {" "}
              <h1 className="text-xl font-bold tracking-tight">
                {" "}
                ApiLens{" "}
              </h1>{" "}
              <p className={`text-xs ${themeClasses.secondaryText}`}>
                {" "}
                REST API Inspector{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Header Controls */}{" "}
          <div className="flex items-center gap-2 sm:gap-3">
            {" "}
            {/* Server */}{" "}
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-500 sm:flex">
              {" "}
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{" "}
              API Engine Online{" "}
            </div>{" "}
            {/* Theme Toggle */}{" "}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${isDark ? "border-white/10 bg-white/5 text-yellow-300 hover:bg-white/10" : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {" "}
              {isDark ? "☀" : "☾"}{" "}
            </button>{" "}
            {/* Clear */}{" "}
            <button
              onClick={clearAll}
              className={`rounded-lg border px-3 py-2 text-sm transition ${isDark ? "border-white/10 bg-white/3 text-slate-300 hover:bg-white/[0.07]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}
            >
              {" "}
              Clear{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </header>{" "}
      <main className="relative mx-auto max-w-7xl px-5 py-7 sm:px-6">
        {" "}
        {/* Hero */}{" "}
        <section className="mb-7">
          {" "}
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-blue-500">
            {" "}
            <span className="h-px w-7 bg-blue-500" /> Developer Workspace{" "}
          </div>{" "}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {" "}
            Inspect APIs.{" "}
            <span className="bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {" "}
              Understand responses.{" "}
            </span>{" "}
          </h2>{" "}
          <p
            className={`mt-2 max-w-2xl text-sm leading-6 ${themeClasses.secondaryText}`}
          >
            {" "}
            Send HTTP requests, inspect response data, analyze headers, measure
            response time, and keep track of your recent requests.{" "}
          </p>{" "}
        </section>{" "}
        {/* Request Builder */}{" "}
        <section
          className={`overflow-hidden rounded-2xl border shadow-xl backdrop-blur-xl transition-colors duration-300 ${themeClasses.card}`}
        >
          {" "}
          <div className={`border-b px-5 py-4 ${themeClasses.divider}`}>
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <div>
                {" "}
                <h3 className="font-semibold"> Request Builder </h3>{" "}
                <p className={`mt-1 text-xs ${themeClasses.secondaryText}`}>
                  {" "}
                  Configure your API endpoint{" "}
                </p>{" "}
              </div>{" "}
              <div
                className={`hidden rounded-lg border px-3 py-2 text-xs md:block ${isDark ? "border-white/10 bg-black/20 text-slate-500" : "border-slate-200 bg-slate-50 text-slate-400"}`}
              >
                {" "}
                REST / HTTP{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-5">
            {" "}
            <div className="flex flex-col gap-3 lg:flex-row">
              {" "}
              {/* Method */}{" "}
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`rounded-xl border px-4 py-3 text-sm font-bold outline-none transition lg:w-32 ${methodStyles[method][isDark ? "dark" : "light"]}`}
              >
                {" "}
                <option className="bg-white text-slate-900"> GET </option>{" "}
                <option className="bg-white text-slate-900"> POST </option>{" "}
                <option className="bg-white text-slate-900"> PUT </option>{" "}
                <option className="bg-white text-slate-900"> PATCH </option>{" "}
                <option className="bg-white text-slate-900">
                  {" "}
                  DELETE{" "}
                </option>{" "}
              </select>{" "}
              {/* URL */}{" "}
              <div className="relative flex-1">
                {" "}
                <span
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm ${isDark ? "text-slate-600" : "text-slate-400"}`}
                >
                  {" "}
                  /{" "}
                </span>{" "}
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendRequest();
                    }
                  }}
                  placeholder="https://jsonplaceholder.typicode.com/users"
                  className={`w-full rounded-xl border py-3 pl-8 pr-4 font-mono text-sm outline-none transition focus:border-blue-500/50 ${themeClasses.input}`}
                />{" "}
              </div>{" "}
              {/* Send */}{" "}
              <button
                onClick={sendRequest}
                disabled={loading}
                className="group relative overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:scale-[1.01] hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {" "}
                {loading ? (
                  <span className="flex items-center gap-2">
                    {" "}
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />{" "}
                    Sending{" "}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {" "}
                    Send{" "}
                    <span className="transition-transform group-hover:translate-x-1">
                      {" "}
                      →{" "}
                    </span>{" "}
                  </span>
                )}{" "}
              </button>{" "}
            </div>{" "}
            {/* Error */}{" "}
            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
                {" "}
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs">
                  {" "}
                  !{" "}
                </span>{" "}
                <div>
                  {" "}
                  <p className="font-semibold"> Request Error </p>{" "}
                  <p className="mt-1 text-xs opacity-80"> {error} </p>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </section>{" "}
        {/* Main Workspace */}{" "}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {" "}
          {/* Request Configuration */}{" "}
          <section
            className={`rounded-2xl border backdrop-blur-xl transition-colors duration-300 ${themeClasses.card}`}
          >
            {" "}
            <div
              className={`flex items-center justify-between border-b px-5 py-4 ${themeClasses.divider}`}
            >
              {" "}
              <div>
                {" "}
                <h3 className="font-semibold"> Request </h3>{" "}
                <p className={`mt-1 text-xs ${themeClasses.secondaryText}`}>
                  {" "}
                  Headers & payload{" "}
                </p>{" "}
              </div>{" "}
              <span
                className={`rounded-md border px-2.5 py-1 text-xs font-bold ${methodStyles[method][isDark ? "dark" : "light"]}`}
              >
                {" "}
                {method}{" "}
              </span>{" "}
            </div>{" "}
            <div className="p-5">
              {" "}
              <label
                className={`mb-2 block text-xs font-medium ${themeClasses.secondaryText}`}
              >
                {" "}
                Request Headers{" "}
              </label>{" "}
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                spellCheck="false"
                className={`h-40 w-full resize-none rounded-xl border p-4 font-mono text-xs leading-6 outline-none transition focus:border-blue-500/40 ${themeClasses.editor}`}
              />{" "}
              <div className="mt-5 flex items-center justify-between">
                {" "}
                <label
                  className={`text-xs font-medium ${themeClasses.secondaryText}`}
                >
                  {" "}
                  JSON Request Body{" "}
                </label>{" "}
                {(method === "GET" || method === "DELETE") && (
                  <span
                    className={`text-[10px] uppercase tracking-wider ${themeClasses.mutedText}`}
                  >
                    {" "}
                    Not used for {method}{" "}
                  </span>
                )}{" "}
              </div>{" "}
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                disabled={method === "GET" || method === "DELETE"}
                spellCheck="false"
                className={`mt-2 h-52 w-full resize-none rounded-xl border p-4 font-mono text-xs leading-6 outline-none transition focus:border-blue-500/40 disabled:cursor-not-allowed disabled:opacity-30 ${themeClasses.editor}`}
              />{" "}
            </div>{" "}
          </section>{" "}
          {/* Response */}{" "}
          <section
            className={`rounded-2xl border backdrop-blur-xl transition-colors duration-300 ${themeClasses.card}`}
          >
            {" "}
            <div
              className={`flex items-center justify-between border-b px-5 py-4 ${themeClasses.divider}`}
            >
              {" "}
              <div>
                {" "}
                <h3 className="font-semibold"> Response </h3>{" "}
                <p className={`mt-1 text-xs ${themeClasses.secondaryText}`}>
                  {" "}
                  Server response inspector{" "}
                </p>{" "}
              </div>{" "}
              {response && (
                <div className="flex items-center gap-2">
                  {" "}
                  <span
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${isSuccess ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500" : "border-red-500/20 bg-red-500/10 text-red-500"}`}
                  >
                    {" "}
                    {response.status}{" "}
                  </span>{" "}
                  <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-500">
                    {" "}
                    {response.responseTime} ms{" "}
                  </span>{" "}
                </div>
              )}{" "}
            </div>{" "}
            {/* Tabs */}{" "}
            <div className={`border-b px-5 pt-4 ${themeClasses.divider}`}>
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <div className="flex gap-1">
                  {" "}
                  <button
                    onClick={() => setActiveTab("body")}
                    className={`rounded-t-lg px-4 py-2 text-xs font-medium transition ${activeTab === "body" ? (isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900") : themeClasses.secondaryText}`}
                  >
                    {" "}
                    Body{" "}
                  </button>{" "}
                  <button
                    onClick={() => setActiveTab("headers")}
                    className={`rounded-t-lg px-4 py-2 text-xs font-medium transition ${activeTab === "headers" ? (isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900") : themeClasses.secondaryText}`}
                  >
                    {" "}
                    Headers{" "}
                  </button>{" "}
                </div>{" "}
                {response && activeTab === "body" && (
                  <button
                    onClick={copyResponse}
                    className={`mb-1 rounded-md border px-3 py-1.5 text-xs transition ${isDark ? "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white" : "border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
                  >
                    {" "}
                    {copied ? "✓ Copied" : "Copy JSON"}{" "}
                  </button>
                )}{" "}
              </div>{" "}
            </div>{" "}
            {/* Response Content */}{" "}
            <div
              className={`h-117.5 overflow-auto transition-colors duration-300 ${isDark ? "bg-[#050810]" : "bg-slate-50"}`}
            >
              {" "}
              {!response ? (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  {" "}
                  <div
                    className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl ${isDark ? "border-white/10 bg-white/3 text-slate-600" : "border-slate-200 bg-white text-slate-300"}`}
                  >
                    {" "}
                    {"</>"}{" "}
                  </div>{" "}
                  <h4
                    className={`font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {" "}
                    No response yet{" "}
                  </h4>{" "}
                  <p
                    className={`mt-2 max-w-sm text-xs leading-5 ${themeClasses.secondaryText}`}
                  >
                    {" "}
                    Enter an API endpoint above and click Send to inspect its
                    response.{" "}
                  </p>{" "}
                </div>
              ) : activeTab === "body" ? (
                <div className="relative p-5">
                  {" "}
                  <div
                    className={`mb-4 flex items-center justify-between text-[10px] uppercase tracking-wider ${themeClasses.mutedText}`}
                  >
                    {" "}
                    <span>JSON</span> <span>{responseLines} lines</span>{" "}
                  </div>{" "}
                  <pre
                    className={`whitespace-pre-wrap font-mono text-xs leading-6 ${themeClasses.responseText}`}
                  >
                    {" "}
                    {JSON.stringify(response.data, null, 2)}{" "}
                  </pre>{" "}
                </div>
              ) : (
                <div className="p-5">
                  {" "}
                  <pre
                    className={`whitespace-pre-wrap font-mono text-xs leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {" "}
                    {JSON.stringify(response.headers, null, 2)}{" "}
                  </pre>{" "}
                </div>
              )}{" "}
            </div>{" "}
          </section>{" "}
        </div>{" "}
        {/* Statistics */}{" "}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {" "}
          <div
            className={`rounded-xl border p-4 transition-colors ${themeClasses.stat}`}
          >
            {" "}
            <p className={`text-xs ${themeClasses.mutedText}`}>
              {" "}
              Requests{" "}
            </p>{" "}
            <p className="mt-1 text-2xl font-bold"> {history.length} </p>{" "}
          </div>{" "}
          <div
            className={`rounded-xl border p-4 transition-colors ${themeClasses.stat}`}
          >
            {" "}
            <p className={`text-xs ${themeClasses.mutedText}`}>
              {" "}
              Last Status{" "}
            </p>{" "}
            <p className="mt-1 text-2xl font-bold">
              {" "}
              {response?.status || "—"}{" "}
            </p>{" "}
          </div>{" "}
          <div
            className={`rounded-xl border p-4 transition-colors ${themeClasses.stat}`}
          >
            {" "}
            <p className={`text-xs ${themeClasses.mutedText}`}>
              {" "}
              Response Time{" "}
            </p>{" "}
            <p className="mt-1 text-2xl font-bold">
              {" "}
              {response ? `${response.responseTime}ms` : "—"}{" "}
            </p>{" "}
          </div>{" "}
          <div
            className={`rounded-xl border p-4 transition-colors ${themeClasses.stat}`}
          >
            {" "}
            <p className={`text-xs ${themeClasses.mutedText}`}> Method </p>{" "}
            <p className="mt-1 text-2xl font-bold"> {method} </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* History */}{" "}
        <section
          className={`mt-6 rounded-2xl border backdrop-blur-xl transition-colors ${themeClasses.card}`}
        >
          {" "}
          <div
            className={`flex items-center justify-between border-b px-5 py-4 ${themeClasses.divider}`}
          >
            {" "}
            <div>
              {" "}
              <h3 className="font-semibold"> Request History </h3>{" "}
              <p className={`mt-1 text-xs ${themeClasses.secondaryText}`}>
                {" "}
                Click a request to load its endpoint{" "}
              </p>{" "}
            </div>{" "}
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-xs text-red-500 transition hover:text-red-400"
              >
                {" "}
                Clear history{" "}
              </button>
            )}{" "}
          </div>{" "}
          <div className="p-4">
            {" "}
            {history.length === 0 ? (
              <div
                className={`rounded-xl border border-dashed p-8 text-center ${isDark ? "border-white/10" : "border-slate-200"}`}
              >
                {" "}
                <p className={`text-sm ${themeClasses.mutedText}`}>
                  {" "}
                  Your recent API requests will appear here.{" "}
                </p>{" "}
              </div>
            ) : (
              <div className="space-y-2">
                {" "}
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className={`group flex w-full flex-col gap-3 rounded-xl border p-3 text-left transition sm:flex-row sm:items-center sm:justify-between ${themeClasses.historyItem}`}
                  >
                    {" "}
                    <div className="flex min-w-0 items-center gap-3">
                      {" "}
                      <span
                        className={`w-16 shrink-0 rounded-md border px-2 py-1 text-center text-[10px] font-bold ${methodStyles[item.method][isDark ? "dark" : "light"]}`}
                      >
                        {" "}
                        {item.method}{" "}
                      </span>{" "}
                      <span
                        className={`truncate font-mono text-xs ${isDark ? "text-slate-400 group-hover:text-slate-200" : "text-slate-500 group-hover:text-slate-800"}`}
                      >
                        {" "}
                        {item.url}{" "}
                      </span>{" "}
                    </div>{" "}
                    <div className="flex shrink-0 items-center gap-4 text-[10px]">
                      {" "}
                      <span
                        className={
                          item.status >= 200 && item.status < 300
                            ? "text-emerald-500"
                            : "text-red-500"
                        }
                      >
                        {" "}
                        {item.status}{" "}
                      </span>{" "}
                      <span className={themeClasses.mutedText}>
                        {" "}
                        {item.responseTime} ms{" "}
                      </span>{" "}
                      <span className={themeClasses.mutedText}>
                        {" "}
                        {item.time}{" "}
                      </span>{" "}
                    </div>{" "}
                  </button>
                ))}{" "}
              </div>
            )}{" "}
          </div>{" "}
        </section>{" "}
        {/* About */}{" "}
        <section
          className={`mt-6 rounded-2xl border p-6 transition-colors ${themeClasses.about}`}
        >
          {" "}
          <div className="grid gap-6 md:grid-cols-2">
            {" "}
            <div>
              {" "}
              <div className="mb-3 flex items-center gap-2">
                {" "}
                <div className="h-2 w-2 rounded-full bg-blue-500" />{" "}
                <h3 className="font-semibold"> About ApiLens </h3>{" "}
              </div>{" "}
              <p className={`text-sm leading-6 ${themeClasses.secondaryText}`}>
                {" "}
                ApiLens is a lightweight REST API inspection platform built for
                developers who want a simple workspace for testing endpoints and
                understanding server responses.{" "}
              </p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p
                className={`mb-3 text-xs font-medium uppercase tracking-wider ${themeClasses.mutedText}`}
              >
                {" "}
                Built With{" "}
              </p>{" "}
              <div className="flex flex-wrap gap-2">
                {" "}
                {[
                  "React",
                  "Tailwind CSS",
                  "Node.js",
                  "Express",
                  "Axios",
                  "REST",
                ].map((tech) => (
                  <span
                    key={tech}
                    className={`rounded-lg border px-3 py-1.5 text-xs ${isDark ? "border-white/10 bg-black/20 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-500"}`}
                  >
                    {" "}
                    {tech}{" "}
                  </span>
                ))}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
      </main>{" "}
      {/* Footer */}{" "}
      <footer
        className={`relative mt-4 border-t py-7 text-center text-xs ${themeClasses.footer}`}
      >
        {" "}
        ApiLens · Developer API Workspace{" "}
      </footer>{" "}
    </div>
  );
}
export default App;
