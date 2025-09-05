import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Heart,
  Shield,
  MessageSquare,
  Sparkles,
  Activity,
  Lock,
  Phone,
  Mic,
  NotebookPen,
  BarChart3,
  Moon,
  SunMedium,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart, CartesianGrid } from "recharts";

// Helper components
const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="py-14 sm:py-20">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  </section>
);

const Chip = ({ icon: Icon, label }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 px-3 py-1 text-sm text-slate-600 dark:text-slate-300">
    <Icon className="h-4 w-4" /> {label}
  </div>
);

const MoodEmoji = ({ value, selected, onSelect }) => {
  const map = {
    1: "😞",
    2: "🙁",
    3: "😐",
    4: "🙂",
    5: "😄",
  };
  return (
    <button
      onClick={() => onSelect(value)}
      className={`text-2xl sm:text-3xl md:text-4xl transition-transform hover:scale-110 ${
        selected === value ? "drop-shadow" : "opacity-80"
      }`}
      aria-label={mood-${value}}
    >
      {map[value]}
    </button>
  );
};

const tips = [
  "Try a 4-7-8 breathing cycle: inhale 4, hold 7, exhale 8.",
  "A 5‑minute walk can reset your stress response.",
  "Name it to tame it: write one sentence about how you feel.",
  "Hydration check: sip some water.",
  "Text someone you trust a simple ‘hi’. Connection matters.",
];

function useDarkMode() {
  const [dark, setDark] = useState(false);
  React.useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);
  return [dark, setDark];
}

export default function MentalWellnessAI() {
  const [dark, setDark] = useDarkMode();
  const [consented, setConsented] = useState(false);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(50);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { who: "assistant", text: "Hey! I’m Lumi, your AI wellness companion. How are you feeling today?" },
  ]);
  const [breathProgress, setBreathProgress] = useState(0);
  const [breathPhase, setBreathPhase] = useState("Inhale");

  const chartData = useMemo(
    () => [
      { day: "Mon", mood: 3, energy: 40 },
      { day: "Tue", mood: 4, energy: 55 },
      { day: "Wed", mood: 2, energy: 35 },
      { day: "Thu", mood: 3, energy: 50 },
      { day: "Fri", mood: 4, energy: 60 },
      { day: "Sat", mood: 5, energy: 75 },
      { day: "Sun", mood: 4, energy: 65 },
    ],
    []
  );

  const sendMessage = () => {
    const text = message.trim();
    if (!text) return;
    setChat((c) => [...c, { who: "user", text }]);
    setMessage("");

    // demo assistant reply (replace with API call to your LLM endpoint)
    const reply =
      mood <= 2
        ? "Thanks for sharing. Would a quick breathing exercise or a grounding tip help right now?"
        : "Noted! I can suggest a short mood‑boosting activity. Up for it?";
    setTimeout(() => setChat((c) => [...c, { who: "assistant", text: reply }]), 400);
  };

  const startBreathing = async () => {
    const phases = [
      { label: "Inhale", secs: 4 },
      { label: "Hold", secs: 4 },
      { label: "Exhale", secs: 6 },
    ];
    for (let i = 0; i < 3; i++) {
      for (const p of phases) {
        setBreathPhase(p.label);
        for (let s = 0; s <= p.secs; s++) {
          setBreathProgress((s / p.secs) * 100);
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }
    setBreathPhase("Done");
    toast.success("Nice work! Your breath cycle is complete.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center text-white shadow">
              <Brain className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-tight">Lumi – AI for Mental Wellness</span>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={!consented}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Shield className="h-4 w-4 mr-2" /> Privacy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Privacy, Safety & Consent</DialogTitle>
                  <DialogDescription>
                    Your chats are private by default. In an emergency, you can quickly reach helplines.
                  </DialogDescription>
                </DialogHeader>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li>• End‑to‑end encrypted transit; no ads; you control deletion.</li>
                  <li>• Not a replacement for professional care. We provide supportive guidance.</li>
                  <li>• Crisis support: Tap the phone button anytime.</li>
                </ul>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Consent to continue</span>
                  </div>
                  <Button onClick={() => setConsented(true)}>I Agree</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} aria-label="toggle theme">
              {dark ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button className="rounded-full">
              <Phone className="h-4 w-4 mr-2" /> Crisis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-10 sm:pt-16 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/40 dark:to-cyan-950/20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              Gentle, private support—powered by Generative AI
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xl">
              Check in with your mood, explore coping tools, and chat with a supportive AI companion trained for empathetic, stigma‑free conversations.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip icon={Heart} label="Empathy‑tuned" />
              <Chip icon={Shield} label="Privacy‑first" />
              <Chip icon={Sparkles} label="Personalized tips" />
            </div>
            <div className="mt-6 flex gap-3">
              <a href="#try" className="inline-flex">
                <Button className="px-5 py-6 text-base rounded-2xl">Try a 2‑min check‑in</Button>
              </a>
              <a href="#features" className="inline-flex">
                <Button variant="outline" className="px-5 py-6 text-base rounded-2xl">Explore features</Button>
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Card className="rounded-2xl shadow-xl border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Quick Mood Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <MoodEmoji key={v} value={v} selected={mood} onSelect={setMood} />
                    ))}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Mood: {mood}/5</div>
                </div>
                <div>
                  <Label htmlFor="energy" className="text-sm">Energy</Label>
                  <Slider id="energy" value={[energy]} onValueChange={(v) => setEnergy(v[0])} className="mt-2" />
                  <div className="mt-1 text-xs text-slate-500">{energy}%</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {tips.map((t, i) => (
                    <div key={i} className="text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      {t}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <Section id="features" title="What you can do" subtitle="A calm space with evidence‑based tools and an AI guide to walk with you.">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: MessageSquare, title: "Supportive AI Chat", desc: "Empathy-tuned conversations for reflection, grounding, and planning next steps." },
            { icon: NotebookPen, title: "Guided Journaling", desc: "CBT-inspired prompts and reframing suggestions to challenge unhelpful thoughts." },
            { icon: BarChart3, title: "Mood Trends", desc: "Track mood & energy, spot patterns, and celebrate progress with weekly insights." },
          ].map((f, i) => (
            <Card key={i} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><f.icon className="h-5 w-5" /> {f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 dark:text-slate-300">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Try section */}
      <Section id="try" title="Try it now" subtitle="This is a functional prototype UI. Hook up your backend/LLM endpoint to make it live.">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat */}
          <Card className="rounded-2xl lg:col-span-2 flex flex-col max-h-[540px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Chat with Lumi</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-3">
              {chat.map((m, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={flex ${m.who === "user" ? "justify-end" : "justify-start"}}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      m.who === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-800 rounded-bl-sm"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type how you’re feeling…"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="rounded-2xl"
              />
              <Button onClick={sendMessage} className="rounded-2xl">
                Send
              </Button>
              <Button variant="outline" size="icon" className="rounded-2xl" title="Voice input (demo)">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Tools */}
          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" /> 3‑cycle Breathing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600 dark:text-slate-300">Follow the cue: inhale, hold, exhale.</div>
                <div className="mt-4">
                  <div className="text-center text-xs uppercase tracking-wide text-slate-500">{breathPhase}</div>
                  <Progress value={breathProgress} className="mt-2" />
                  <div className="mt-4 flex gap-2">
                    <Button onClick={startBreathing} className="flex-1 rounded-2xl">Start</Button>
                    <Button variant="outline" onClick={() => { setBreathProgress(0); setBreathPhase("Inhale"); }} className="rounded-2xl">Reset</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><NotebookPen className="h-5 w-5" /> Guided Journal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea placeholder="Write a few lines about what’s on your mind…" className="min-h-[110px]" />
                <Button variant="outline" className="rounded-2xl w-full">Suggest a CBT Reframe</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Insights */}
      <Section id="insights" title="Your weekly insights" subtitle="Spot patterns that help you plan better days.">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Mood & Energy (7 days)</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 5]} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Energy Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="energy" strokeWidth={2} fill="url(#grad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Preferences & Safety */}
      <Section id="preferences" title="Preferences & Safety">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Conversation Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="gentle">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="gentle">Gentle</TabsTrigger>
                  <TabsTrigger value="direct">Direct</TabsTrigger>
                  <TabsTrigger value="coach">Coach</TabsTrigger>
                </TabsList>
                <TabsContent value="gentle" className="text-sm text-slate-600 dark:text-slate-300">
                  Supportive, validating, and warm.
                </TabsContent>
                <TabsContent value="direct" className="text-sm text-slate-600 dark:text-slate-300">
                  Concise guidance focused on actions.
                </TabsContent>
                <TabsContent value="coach" className="text-sm text-slate-600 dark:text-slate-300">
                  Motivational with gentle challenges.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reminder">Daily mood reminder</Label>
                <Switch id="reminder" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tips">Micro‑tips</Label>
                <Switch id="tips" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="streaks">Progress streaks</Label>
                <Switch id="streaks" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Safety Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Add trusted contacts</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> Local helpline shortcut</div>
              <div className="flex items-center gap-2"><Lock className="h-4 w-4" /> Quick hide & auto‑delete options</div>
              <Button variant="outline" className="w-full rounded-2xl mt-2">Configure</Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 items-start">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center text-white shadow">
                <Brain className="h-5 w-5" />
              </div>
              <span className="font-semibold tracking-tight">Lumi</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm">
              Built for youth mental wellness. Compassionate by design. Privacy by default.
            </p>
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-300">
            <div className="font-medium text-slate-900 dark:text-slate-100 mb-2">Disclaimers</div>
            This app is supportive and educational. It is not a medical device and does not replace professional diagnosis or treatment.
          </div>

          <div className="text-sm flex flex-col gap-2">
            <div className="font-medium text-slate-900 dark:text-slate-100">Resources</div>
            <a className="underline underline-offset-4" href="#">Emergency resources</a>
            <a className="underline underline-offset-4" href="#">Privacy policy</a>
            <a className="underline underline-offset-4" href="#">Model & safety card</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Lumi Wellness. All rights reserved.
        </div>
      </footer>

      {/* Floating avatar */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-4 right-4 hidden sm:flex items-center gap-3 p-3 rounded-2xl shadow-lg bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur"
        >
          <Avatar>
            <AvatarFallback className="bg-indigo-600 text-white">AI</AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <div className="font-medium">Need support?</div>
            <div className="text-slate-600 dark:text-slate-300">I'm here to chat.</div>
          </div>
          <a href="#try" className="inline-flex">
            <Button size="sm" className="rounded-xl">Open</Button>
          </a>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}             I wanna push this code into github, which extension file to use?
