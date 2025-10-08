import { useState } from "react";
import { Search, Sparkles, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const Index = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Perhatian",
        description: "Silakan masukkan query pencarian",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classify-sakernas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memproses klasifikasi");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memproses klasifikasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const examples = [
    { icon: FileText, text: "petani padi", color: "text-primary" },
    { icon: Sparkles, text: "industri mie soun", color: "text-secondary" },
    { icon: MessageSquare, text: "pengemudi taksi", color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Sistem Klasifikasi SAKERNAS 2025</span>
            </div>
            
            <h1 className="mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              Klasifikasi Data SAKERNAS BPS
            </h1>
            
            <p className="mb-12 text-lg text-muted-foreground md:text-xl">
              AI Agent untuk klasifikasi lapangan usaha dan jenis pekerjaan berdasarkan{" "}
              <span className="font-semibold text-foreground">Buku Kode SAKERNAS Agustus 2025</span>
            </p>

            {/* Search Box */}
            <Card className="mx-auto max-w-2xl bg-card/50 p-6 shadow-elegant backdrop-blur-sm">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder='Contoh: "petani padi", "industri mie", "pengemudi taksi"'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-14 pl-12 pr-4 text-base"
                  />
                </div>
                
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  size="lg"
                  className="h-12 bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-glow transition-all hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Klasifikasi Sekarang
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Examples */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-muted-foreground">Coba contoh:</span>
                {examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(example.text)}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm transition-colors hover:bg-muted/80"
                  >
                    <example.icon className={`h-3 w-3 ${example.color}`} />
                    <span>{example.text}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="container mx-auto px-4 pb-16">
          <Card className="mx-auto max-w-4xl bg-card/80 p-8 shadow-elegant backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Hasil Klasifikasi</h2>
                <p className="text-sm text-muted-foreground">
                  Berdasarkan SAKERNAS Agustus 2025
                </p>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-lg border border-border">
                      <table className="w-full border-collapse">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-muted/50">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="border-b border-border px-4 py-3 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border-b border-border px-4 py-3">{children}</td>
                  ),
                  p: ({ children }) => (
                    <p className="my-3 leading-relaxed text-foreground">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-primary">{children}</strong>
                  ),
                }}
              >
                {result}
              </ReactMarkdown>
            </div>

            <Button
              onClick={() => {
                setQuery("");
                setResult("");
              }}
              variant="outline"
              className="mt-6"
            >
              Klasifikasi Baru
            </Button>
          </Card>
        </section>
      )}

      {/* Features Section */}
      {!result && (
        <section className="container mx-auto px-4 pb-16">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Lapangan Usaha",
                description: "Klasifikasi berdasarkan KBLI 2020 untuk berbagai sektor industri dan usaha",
              },
              {
                icon: MessageSquare,
                title: "Jenis Pekerjaan",
                description: "Klasifikasi berdasarkan KBJI 2014 untuk berbagai golongan pekerjaan",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Menggunakan AI untuk memberikan hasil klasifikasi yang akurat dan cepat",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/30 p-6 transition-all hover:shadow-elegant"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Badan Pusat Statistik - Direktorat Statistik Kependudukan dan Ketenagakerjaan
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Berdasarkan Buku Kode SAKERNAS Agustus 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
