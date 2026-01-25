import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemoryDTO, MemoryCategory, MemoryMood } from "@/types/memory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Image as ImageIcon } from "lucide-react";

// Schema Validation
const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    date: z.string().min(1, "Date is required"),
    category: z.string().min(1, "Category is required"),
    location: z.string().optional(),
    mood: z.string().optional(),
    quote: z.string().optional(),
    story: z.string().optional(),
    tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
    images: z.array(z.object({
        url: z.string().min(1, "Path or URL is required")
    })).min(1, "At least one image is required")
});

type FormValues = z.infer<typeof formSchema>;

interface MemoryFormProps {
    initialData?: Partial<MemoryDTO>;
    onSubmit: (data: MemoryDTO) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const MemoryForm: React.FC<MemoryFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const defaultValues: Partial<FormValues> = {
        title: initialData?.title || "",
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: initialData?.category || "Random",
        location: initialData?.location || "",
        mood: initialData?.mood || "sweet",
        quote: initialData?.quote || "",
        story: initialData?.story || "",
        tags: initialData?.tags?.join(", ") as any || "",
        images: initialData?.images?.map(img => ({ url: img.url })) || [{ url: "" }]
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "images"
    });

    const [isDragActive, setIsDragActive] = React.useState(false);

    const handleImageUpload = (files: File[]) => {
        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert("File too large! Max 5MB.");
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert("Please upload an image file.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                append({ url: base64 }); // Add to the form array
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = (values: FormValues) => {
        const dto: MemoryDTO = {
            title: values.title,
            date: new Date(values.date).toISOString(),
            category: values.category as MemoryCategory,
            location: values.location,
            mood: values.mood as MemoryMood,
            quote: values.quote,
            story: values.story,
            tags: values.tags as any as string[],
            images: values.images.map(img => ({ url: img.url, alt: values.title })) // Simplified image handling
        };
        onSubmit(dto); // DTO might have mismatch if zod transform isn't handled perfectly, simplified here
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Our Magical Day..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="First Date">First Date</SelectItem>
                                        <SelectItem value="Anniversary">Anniversary</SelectItem>
                                        <SelectItem value="Travel">Travel</SelectItem>
                                        <SelectItem value="Random">Random</SelectItem>
                                        <SelectItem value="Letters">Letters</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mood"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mood</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select mood" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="sweet">🍬 Sweet</SelectItem>
                                        <SelectItem value="silly">🤪 Silly</SelectItem>
                                        <SelectItem value="romantic">💖 Romantic</SelectItem>
                                        <SelectItem value="adventure">🗺️ Adventure</SelectItem>
                                        <SelectItem value="chill">🍃 Chill</SelectItem>
                                        <SelectItem value="serious">🧐 Serious</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Paris, My Room, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="love, sunset, funny" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="quote"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quote of the day</FormLabel>
                            <FormControl>
                                <Input placeholder="&quot;Something poetic...&quot;" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="story"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>The Story</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Write your heart out..." className="h-32" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Image Upload Area */}
                <div className="space-y-3">
                    <FormLabel>Memory Photo</FormLabel>

                    {/* Drag & Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50/50'
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                        onDragLeave={() => setIsDragActive(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragActive(false);
                            const files = Array.from(e.dataTransfer.files);
                            handleImageUpload(files);
                        }}
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        <input
                            id="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) handleImageUpload(Array.from(e.target.files));
                            }}
                        />
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                            <ImageIcon className="text-pink-500" size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-700">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max 5MB)</p>
                    </div>

                    {/* Image Previews */}
                    {fields.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                            {fields.map((field, index) => {
                                const url = form.getValues(`images.${index}.url`);
                                return (
                                    <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                        <img
                                            src={url}
                                            alt={`Preview ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Manual URL Input (Collapsible/Optional) */}
                    <div className="text-right">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-400 hover:text-pink-500"
                            onClick={() => append({ url: "" })}
                        >
                            Or add via URL link
                        </Button>
                    </div>

                    {/* Render URL inputs ONLY if they are empty strings or short manual entries */}
                    {fields.map((field, index) => {
                        const val = form.getValues(`images.${index}.url`);
                        if (val && val.startsWith('data:')) return null; // Don't show input for base64 images
                        const isBase64 = val?.startsWith('data:image');
                        if (isBase64) return null;

                        return (
                            <div key={field.id} className="flex gap-2 mt-2">
                                <Input
                                    {...form.register(`images.${index}.url`)}
                                    placeholder="https://..."
                                    className="text-xs"
                                />
                                <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                                    <X size={16} />
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-pink-500 hover:bg-pink-600 text-white font-bold">
                        {isLoading ? "Saving..." : "Save Memory"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
