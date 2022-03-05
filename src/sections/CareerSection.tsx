const CareerSection = () => {
    return (
        <section className="mb-3 border-b-2 border-b-gray-200 py-2">
            <h2 className="print:text-[16pt] text-2xl font-bold mb-2">Career</h2>
            <div className="grid grid-cols-12 print:text-[11pt] text-lg gap-3">
                <p className="md:col-span-2 col-span-3 text-gray-500">2022.01 ~ 2022.02</p>
                <p className="md:col-span-10 col-span-9"><a href="https://promedius.ai">프로메디우스</a>에서 인프라팀 인턴으로</p>
            </div>
        </section>
    )
}

export default CareerSection;