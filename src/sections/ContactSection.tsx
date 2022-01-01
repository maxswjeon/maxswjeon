const ContactSection = () => {
    return (
        <section className="mb-3 border-b-2 border-b-gray-200 py-2">
            <h2 className="print:text-[16pt] text-2xl font-bold mb-2">Contact & Social</h2>
            <div className="grid grid-cols-12 print:text-[11pt] text-lg gap-3">
                <p className="font-bold lg:col-span-2 col-span-3">Email</p>
                <p className="lg:col-span-4 col-span-9">
                    <a href="mailto://maxswjeon@gmail.com">maxswjeon@gmail.com</a>
                </p>
                <p className="font-bold lg:col-span-2 col-span-3">Github</p>
                <p className="lg:col-span-4 col-span-9">
                    <a href="https://github.com/maxswjeon">@maxswjeon</a>
                </p>
                <p className="font-bold lg:col-span-2 col-span-3">Facebook</p>
                <p className="lg:col-span-4 col-span-9">
                    <a href="https://facebook.com/maxswjeon2">@maxswjeon2</a>
                </p>
                <p className="font-bold lg:col-span-2 col-span-3">Linkedin</p>
                <p className="lg:col-span-4 col-span-9">
                    <a href="https://www.linkedin.com/in/maxswjeon">@maxswjeon</a>
                </p>
            </div>
        </section>
    );
};

export default ContactSection;
