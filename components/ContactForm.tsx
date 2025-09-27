"use client";

import { ContactFormData, contactSchema } from "@/schema/contactSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = ["Device", "App", "Shipping", "Other"] as const;

export default function ContactForm() {
    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: "onBlur",
        // todo: do we need these?
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            countryCode: "US",
            phoneNumber: "",
            message: "",
            category: [],
        },
    });

    const onSubmit = async (values: ContactFormData) => {
        // const success = sendDiscordMessage(values);
        // TODO: Show confirmation message on the website: "Thank you for your message! We will get back to you soon."

        console.log(values);

        try {
            const res = await fetch("/api/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) throw new Error("Error sending message");

            toast.success("Thank you for your message! We will get back to you soon.");
            form.reset();
        } catch (e) {
            console.error("Form Error:", e);
            toast.error("Error submitting form. Please try again");
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input
                                        placeholder="First name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input placeholder="Last name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <select
                                        className="bg-input w-full rounded-md border p-2 text-slate-100"
                                        {...field}>
                                        <option value="US">US</option>
                                        <option value="CA">CA</option>
                                        <option value="UK">UK</option>
                                        {/* Add more countries as needed */}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input
                                        placeholder="+1 (555) 000-0000"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Leave us a message..."
                                    {...field}
                                    rows={4}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-wrap gap-4">
                                {CATEGORY_OPTIONS.map(
                                    (option) => (
                                        <label
                                            key={option}
                                            className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={field.value?.includes(
                                                    option,
                                                )}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        field.onChange([
                                                            ...(field.value ||
                                                                []),
                                                            option,
                                                        ]);
                                                    } else {
                                                        field.onChange(
                                                            field.value?.filter(
                                                                (item) =>
                                                                    item !==
                                                                    option,
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ),
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    <FaPaperPlane />
                    Send message
                </Button>
            </form>
        </Form>
    );
}
