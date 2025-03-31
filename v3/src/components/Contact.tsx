// tell nextjs to render on the client side
"use client";
import Image from "next/image";
import Heading from "./sub/Heading";
import { motion } from "framer-motion";

const Contact = () => {
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      title: formData.get("subject"),
      message: formData.get("message"),
    };

    fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
        template_params: data,
      }
    ),
    })
      .then((response) => {
        if (response.ok) {
          alert("Message sent successfully!");
          form.reset();
        } else {
          alert("Failed to send message.");
        }
      })
      .catch(() => alert("An error occurred while sending the message."));
  };

  return (
    <div id="contact" className="py-20 h-screen lg:h-auto lg:py-40 xs:pb-20">
      <Heading text={"Contact me"} />
      <div className="w-full my-auto flex lg:flex-col items-center justify-between lg:justify-center gap-x-20 lg:gap-x-0 gap-y-20">
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <Image
            src={"/contact-me.png"}
            alt="Contact me image"
            width={400}
            height={400}
            className="w-[400px] rounded-md opacity-90 transform -scale-x-100"
          />
        </motion.div>
        <motion.form
          initial={{ opacity: 0, x: 150 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="w-[600px] lg:w-[400px] sm:w-full flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            sendEmail(e);
          }}
        >
          <div className="w-full flex lg:flex-col gap-x-3 lg:gap-y-3">
            <input
              type="text"
              name="name"
              className="w-full border border-yellow-500 rounded-md bg-zinc-100 px-4 py-2 text-sm tracking-wider text-gray-800 placeholder:text-gray-600 outline-none"
              placeholder="Your Name"
              required
            />
            <input
              type="email"
              name="email"
              className="w-full border border-yellow-500 rounded-md bg-zinc-100 px-4 py-2 text-sm tracking-wider text-gray-800 placeholder:text-gray-600 outline-none"
              placeholder="Your Email"
              required
            />
          </div>
          <input
            type="text"
            name="subject"
            className="w-full border border-yellow-500 rounded-md bg-zinc-100 px-4 py-2 text-sm tracking-wider text-gray-800 placeholder:text-gray-600 outline-none"
            placeholder="Subject"
            required
          />
          <textarea
            name="message"
            className="max-h-[250px] min-h-[150px] border border-yellow-500 rounded-md bg-zinc-100 px-4 py-2 text-sm tracking-wider text-gray-800 placeholder:text-gray-600 outline-none"
            placeholder="Your message"
            required
          ></textarea>
          <input
            type="submit"
            className="w-full border border-yellow-700 bg-yellow-600 rounded-md px-4 py-2 text-sm tracking-wider text-white outline-none hover:bg-yellow-500 transition-colors cursor-pointer"
            value="Send Message"
          />
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
