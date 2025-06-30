import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Truck } from "lucide-react";

export const CallToAction = () => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/10">
            <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-foreground mb-4">Siap untuk Mengubah Kebiasaan Makan Anda?</h2>
                        <p className="text-xl text-muted-foreground font-medium">
                            Bergabunglah dengan ribuan pelanggan yang puas yang telah beralih ke makanan yang lebih sehat dan lezat.
                        </p>
                    </div>

                    <Card className="bg-primary text-primary-foreground border-0 shadow-xl rounded-2xl">
                        <CardContent className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mr-4">
                                        <Users className="h-8 w-8 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-black text-xl">Customer Success Manager</p>
                                        <p className="text-primary-foreground/90 font-semibold">Brian Santoso</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mr-4">
                                        <Truck className="h-8 w-8 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-black text-xl">Kontak Langsung</p>
                                        <p className="text-primary-foreground/90 font-semibold">+62 812-3456-789</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <Button
                                    size="lg"
                                    className="bg-primary-foreground text-primary hover:bg-white/90 px-8 text-lg font-black rounded-lg shadow-lg"
                                    asChild
                                >
                                    <Link href="/contact">
                                        Mulai Perjalanan Anda Hari Ini
                                        <ArrowRight className="ml-3 h-6 w-6" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};