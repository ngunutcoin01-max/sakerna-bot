import { useState } from "react";
import { Search, Sparkles, Building2, Users, CheckCircle } from "lucide-react";
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

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Dynamic Background */}
      <div className="relative overflow-hidden py-24 px-4" style={{ background: 'var(--gradient-hero)' }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
              🤖 Powered by Lovable AI
            </span>
          </div>
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl leading-tight tracking-tight drop-shadow-lg animate-fade-in">
            Klasifikasi SAKERNAS<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">BPS 2025</span>
          </h1>
          <p className="mb-10 text-xl text-white/90 md:text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AI Agent untuk klasifikasi <strong>Lapangan Usaha (KBLI)</strong> dan <strong>Jenis Pekerjaan (KBJI)</strong> berdasarkan Buku Kode SAKERNAS Agustus 2025
          </p>

          {/* Search Box with Enhanced Design */}
          <Card className="p-8 backdrop-blur-sm bg-white/95 dark:bg-card/95 border-2 border-white/20 animate-fade-in" 
                style={{ 
                  boxShadow: 'var(--shadow-elegant)',
                  animationDelay: '0.4s' 
                }}>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Contoh: petani padi, pengemudi taksi, guru SD, pedagang kios..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 text-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                disabled={isLoading || !query.trim()}
                className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-3 border-background border-t-transparent" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Klasifikasi Sekarang
                  </>
                )}
              </Button>
            </form>

            {/* Quick Examples with Modern Design */}
            <div className="mt-8">
              <p className="text-center text-sm text-muted-foreground mb-4 font-medium">✨ Contoh Pencarian Populer:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["petani padi", "pengemudi taksi", "guru SD", "pedagang kios", "dokter umum", "tukang bangunan"].map((example, idx) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(example)}
                    disabled={isLoading}
                    className="hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all animate-fade-in"
                    style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Results Section with Enhanced Design */}
      {result && (
        <div className="container mx-auto max-w-5xl px-4 py-12 animate-fade-in">
          <Card className="overflow-hidden border-2 border-primary/20" 
                style={{ 
                  boxShadow: 'var(--shadow-elegant)',
                  background: 'var(--gradient-card)'
                }}>
            <div className="bg-gradient-to-r from-primary to-secondary p-6">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold">Hasil Klasifikasi</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    table: ({ children }) => (
                      <div className="my-6 overflow-x-auto rounded-lg border-2 border-primary/20">
                        <table className="w-full border-collapse">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="border-b-2 border-primary/20 px-6 py-4 text-left font-bold text-foreground">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border-b border-border px-6 py-4 text-foreground">{children}</td>
                    ),
                    p: ({ children }) => (
                      <p className="my-4 leading-relaxed text-foreground">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-primary">{children}</strong>
                    ),
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
              <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  📊 Sumber: Buku Kode SAKERNAS Agustus 2025
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => { setResult(""); setQuery(""); }}
                  className="hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Cari Lagi
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Features Section with Modern Cards */}
      {!result && (
        <div className="container mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Fitur Unggulan
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Sistem klasifikasi berbasis AI dengan akurasi tinggi dan database lengkap
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group p-8 text-center border-2 hover:border-primary/50 transition-all hover:scale-105 animate-fade-in" 
                  style={{ 
                    boxShadow: 'var(--shadow-card)',
                    animationDelay: '0.1s'
                  }}>
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl p-5 group-hover:scale-110 transition-transform" 
                     style={{ background: 'var(--gradient-accent)' }}>
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold">Lapangan Usaha</h3>
              <p className="text-muted-foreground leading-relaxed">
                Klasifikasi <strong>KBLI 2020</strong> dengan <strong>300+ kode</strong> lapangan usaha 5 digit yang detail dan akurat
              </p>
            </Card>

            <Card className="group p-8 text-center border-2 hover:border-secondary/50 transition-all hover:scale-105 animate-fade-in" 
                  style={{ 
                    boxShadow: 'var(--shadow-card)',
                    animationDelay: '0.2s'
                  }}>
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl p-5 group-hover:scale-110 transition-transform" 
                     style={{ background: 'var(--gradient-accent)' }}>
                  <Users className="h-10 w-10 text-secondary" />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold">Jenis Pekerjaan</h3>
              <p className="text-muted-foreground leading-relaxed">
                Klasifikasi <strong>KBJI 2014</strong> dengan <strong>200+ kode</strong> jenis pekerjaan 4 digit yang komprehensif
              </p>
            </Card>

            <Card className="group p-8 text-center border-2 hover:border-accent/50 transition-all hover:scale-105 animate-fade-in" 
                  style={{ 
                    boxShadow: 'var(--shadow-card)',
                    animationDelay: '0.3s'
                  }}>
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl p-5 group-hover:scale-110 transition-transform" 
                     style={{ background: 'var(--gradient-accent)' }}>
                  <Sparkles className="h-10 w-10 text-accent" />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold">AI-Powered</h3>
              <p className="text-muted-foreground leading-relaxed">
                Menggunakan <strong>Lovable AI</strong> untuk klasifikasi otomatis yang <strong>cepat & akurat</strong>
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Modern Footer */}
      <footer className="relative border-t-2 border-primary/20 mt-20" style={{ background: 'var(--gradient-card)' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl px-4 py-12 relative z-10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                SAKERNAS BPS 2025
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              © 2025 <strong>Badan Pusat Statistik (BPS)</strong>. Semua klasifikasi berdasarkan Buku Kode SAKERNAS Agustus 2025.
            </p>
            <div className="pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Powered by <span className="text-primary font-semibold">Lovable AI</span> • 
                Data accurate as of August 2025
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
