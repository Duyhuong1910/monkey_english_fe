import React, { useEffect } from "react";

function Home() {
  // 🔸 Giữ nguyên logic Observer để kích hoạt animation
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in, .slide-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* HERO SECTION - Banner chính */}
      <section className="container mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 fade-in">
        <div className="flex-1 space-y-8">
          <p className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
            🌟 Nền tảng học tiếng Anh hàng đầu
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Học tiếng Anh <br />
            <span className="text-blue-600">cùng Monkey</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-lg">
            Phương pháp học hiện đại, giáo trình chuẩn quốc tế, giúp bạn tự tin
            giao tiếp tiếng Anh trong thời gian ngắn nhất.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30">
              Khám phá khóa học →
            </button>
            {/* <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2">
              <span className="text-blue-600">▶</span> Xem demo
            </button> */}
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            <div className="flex gap-3 items-start">
              <span className="text-2xl">👨‍🎓</span>
              <div>
                <strong className="block text-slate-900">
                  10,000+ học viên
                </strong>
                <span className="text-sm text-slate-500">
                  Đang học mỗi ngày
                </span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-2xl">⭐</span>
              <div>
                <strong className="block text-slate-900">
                  4.9 / 5 đánh giá
                </strong>
                <span className="text-sm text-slate-500">
                  Phản hồi tích cực
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative slide-up">
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20 -z-10"></div>
          <img
            src="/assets/images/anh_1.webp"
            alt="Học tiếng Anh cùng Monkey"
            className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl object-cover"
          />
          <div className="absolute bottom-6 left-[-20px] bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
            <div className="bg-green-100 text-green-600 p-2 rounded-full">
              📈
            </div>
            <div>
              <p className="font-bold text-slate-800">98%</p>
              <p className="text-xs text-slate-500">Hoàn thành khóa học</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-blue-600 text-white py-16 fade-in">
        <div className="container mx-auto px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
            {[
              { num: "10,000+", label: "Học viên đăng ký" },
              { num: "50+", label: "Khóa học chất lượng" },
              { num: "30+", label: "Giảng viên kinh nghiệm" },
              { num: "98%", label: "Tỷ lệ hài lòng" },
              { num: "3+", label: "Năm kinh nghiệm" },
              { num: "24/7", label: "Học mọi lúc, mọi nơi" },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-3xl font-extrabold">{stat.num}</h3>
                <p className="text-blue-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Được tin tưởng bởi hàng nghìn học viên – Đồng hành cùng bạn trên
            hành trình chinh phục tiếng Anh mỗi ngày.
          </p>
        </div>
      </section>

      {/* LỘ TRÌNH HỌC */}
      <section className="container mx-auto px-6 py-20 fade-in">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Lộ trình học tiếng Anh tại Monkey
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Lộ trình được thiết kế khoa học từ cơ bản đến nâng cao, giúp người
            học tiếp thu tiếng Anh một cách tự nhiên, dễ hiểu và bền vững theo
            từng giai đoạn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Đánh giá trình độ",
              desc: "Kiểm tra toàn diện kỹ năng nghe, nói, đọc, viết để xác định chính xác trình độ hiện tại.",
            },
            {
              step: "02",
              title: "Xây dựng nền tảng",
              desc: "Phát triển từ vựng, phát âm chuẩn và ngữ pháp cốt lõi thông qua bài học sinh động.",
            },
            {
              step: "03",
              title: "Thực hành & giao tiếp",
              desc: "Luyện tập giao tiếp theo tình huống thực tế, giúp tăng phản xạ và tự tin.",
            },
            {
              step: "04",
              title: "Cá nhân hóa",
              desc: "Hệ thống theo dõi quá trình học, đánh giá kết quả và điều chỉnh nội dung phù hợp.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 relative overflow-hidden group"
            >
              <div className="text-6xl font-black text-blue-50 absolute -top-4 -right-4 transition group-hover:scale-110">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 relative z-10">
                {item.title}
              </h3>
              <p className="text-slate-600 relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MONKEY DÀNH CHO AI */}
      <section className="bg-slate-100 py-20 fade-in">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Monkey English dành cho ai?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Dù bạn đang ở bất kỳ trình độ nào, Monkey English luôn có lộ trình
              phù hợp để đồng hành và giúp bạn tiến bộ rõ rệt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Người mới bắt đầu",
                desc: "Phù hợp cho người mất gốc, cần phương pháp dễ hiểu, học từ nền tảng.",
                icon: "🌱",
              },
              {
                title: "Học sinh – Sinh viên",
                desc: "Củng cố kiến thức, cải thiện điểm số và nâng cao khả năng giao tiếp.",
                icon: "🎒",
              },
              {
                title: "Người đi làm",
                desc: "Phát triển kỹ năng giao tiếp trong công việc, mở rộng cơ hội nghề nghiệp.",
                icon: "💼",
              },
              {
                title: "Người bận rộn",
                desc: "Lộ trình linh hoạt, học mọi lúc mọi nơi, dễ dàng duy trì thói quen.",
                icon: "⏱️",
              },
            ].map((user, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl text-center shadow-sm hover:-translate-y-1 transition duration-300"
              >
                <div className="text-4xl mb-4">{user.icon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {user.title}
                </h3>
                <p className="text-slate-600 text-sm">{user.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY MONKEY SECTION */}
      <section className="container mx-auto px-6 py-20 fade-in">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Tại sao chọn Monkey English?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Phương pháp học tiếng Anh hiện đại, cá nhân hóa theo từng trình độ.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              img: "anh_sach_1.jpg",
              title: "Giáo trình chuẩn quốc tế",
              desc: "Nội dung biên soạn bởi chuyên gia hàng đầu.",
            },
            {
              img: "anh_tuong_tac.jpg",
              title: "Học tập tương tác",
              desc: "Bài học sinh động, nhiều hoạt động giúp ghi nhớ lâu.",
            },
            {
              img: "anh_chung_chi.jpg",
              title: "Chứng chỉ uy tín",
              desc: "Nhận chứng chỉ đạt chuẩn quốc tế sau khóa học.",
            },
            {
              img: "giao_trinh_QT.jpg",
              title: "Bám sát khung CEFR",
              desc: "Phù hợp mọi trình độ từ A1 đến C2.",
            },
            {
              img: "lo_trinh_hoa.jpg",
              title: "Lộ trình cá nhân hóa",
              desc: "Phù hợp mục tiêu và thời gian của từng học viên.",
            },
            {
              img: "doi_ngu_GV.jpg",
              title: "Giáo viên chuyên nghiệp",
              desc: "Giáo viên bản ngữ, giàu kinh nghiệm giảng dạy.",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 slide-up group"
            >
              <div className="h-48 overflow-hidden bg-slate-200">
                <img
                  src={`/assets/images/${card.img}`}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-600">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION - Kêu gọi hành động */}
      <section className="bg-blue-900 py-16 lg:py-24 slide-up">
        <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="flex-1 text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Bắt đầu hành trình học tiếng Anh của bạn ngay hôm nay
            </h2>
            <p className="text-blue-200 text-lg">
              Monkey English mang đến phương pháp học mới mẻ, hiệu quả và dễ
              hiểu. Hàng ngàn học viên đã đạt kết quả ấn tượng!
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-400">✅</span> Tập nói tiếng Anh tự
                nhiên
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✅</span> Cải thiện phát âm và
                từ vựng
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✅</span> Giảng viên tận tâm,
                bài học sinh động
              </li>
            </ul>
            <button className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition transform hover:-translate-y-1 shadow-lg">
              Đăng ký ngay miễn phí
            </button>
          </div>
          <div className="flex-1">
            <img
              src="/assets/images/anh_2.webp"
              alt="Giảng viên Monkey"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition duration-500"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
