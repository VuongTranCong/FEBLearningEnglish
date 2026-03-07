/**
 * Hướng dẫn cho phụ huynh và bé theo từng ngày.
 * Key: "monthId-dayInMonth". Dùng "default" khi không có key cụ thể.
 */
const PARENT_GUIDES = {
  default: 'Mỗi buổi học khoảng 15–20 phút là đủ. Cùng xem/nghe với bé, sau đó dùng thẻ từ để ôn. Khuyến khích bé nói theo và làm động tác. Nếu có hoạt động, làm cùng bé và khen ngợi nỗ lực.',
  '1-1': 'Hôm nay học động từ hành động cơ bản. Ngồi cùng bé, xem video và nhắc bé nói theo. Làm động tác (nhảy, chạy, ngồi) cùng bé để bé gắn từ với hành động.',
  '1-2': 'Ôn động từ ngày hôm trước, rồi xem video mới. Tạm dừng video và hỏi: "Can you do this?" rồi làm động tác để bé bắt chước.',
  '1-3': 'Ôn nhanh hai ngày trước, rồi xem video hôm nay. Dùng thẻ từ, chỉ vào hình và hỏi: "What is he/she doing?"',
  '1-4': 'Tập trung vào "What do you like to do?" Hỏi bé bằng tiếng Anh: "Do you like to jump? Do you like to sing?" và trả lời cùng bé.',
  '1-5': 'Luyện "want to" (I want to run, I want to sleep). Khuyến khích bé nói câu ngắn: "I want to …"',
  '1-6': '"What can you do?" là câu hỏi quan trọng. Sau video, hỏi bé và gợi ý trả lời "I can jump," "I can clap," … Làm hoạt động nếu có thời gian.',
  '1-7': 'Hôm nay nhiều động tác (Jump Up High, Jump Around). Đứng dậy làm cùng bé—vừa vui vừa dễ nhớ.',
  '1-8': 'Magic Wand vui và dễ thuộc. Dùng bút chì hoặc que làm "cây đũa thần" và nói câu trong bài cùng bé.',
  '1-9': 'Dạy "I have a bad cold" và từ chỉ bộ phận cơ thể (nose, tissue). Dùng thẻ từ chỉ vào từng phần.',
  '1-10': 'Luyện "How are you?" và câu trả lời (happy, sad, tired). Từ nay dùng câu này chào bé mỗi ngày.',
  '1-12': 'Cùng bé làm hoạt động Octopus Sing and Play. Xem video hướng dẫn trước, rồi làm thủ công hoặc chơi.',
  '1-21': 'Ôn đi bộ và cảm xúc. Hỏi "How are you today?" và "Can you walk? Can you run?"',
  '1-22': 'Ngày ôn tập. Cùng bé làm hoạt động Tô màu cá. Giữ không khí thoải mái, vui.',
  '2-1': 'Làm quen động vật dưới nước. Chỉ từng con trên thẻ từ và đọc tên; nhắc bé nói theo.',
  '2-3': 'Côn trùng thường khiến bé thích. Nếu được, ra ngoài tìm côn trùng thật và gọi tên bằng tiếng Anh.',
  '2-7': 'Động vật nông trại quen thuộc. Hôm nay làm Hoạt động Động vật nông trại—thủ công hoặc bài tập.',
  '2-12': 'Ngày chơi game! Cùng chơi Domino động vật hoặc Câu cá. Gọi tên động vật bằng tiếng Anh khi chơi.',
  '3-1': 'Bắt đầu với "My House." Đi quanh nhà và chỉ: "This is the living room," "This is the kitchen."',
  '3-5': 'Phòng ăn và bếp có nhiều từ. Dành vài phút trong bếp và gọi tên đồ vật bằng tiếng Anh.',
  '3-8': 'Ôn tất cả các phòng. Đi từng phòng và gọi tên phòng cùng vài đồ vật trong phòng.'
};

const KID_GUIDES = {
  default: '1) Xem video. 2) Nghe bài hát. 3) Xem thẻ từ và nói từ. 4) Làm hoạt động nếu có. Chúc vui!',
  '1-1': 'Xem video động từ, rồi làm động tác: jump, run, sit, stand. Nói từ theo video nhé!',
  '1-6': 'Học "What can you do?" Nói "I can jump! I can clap!" Làm bài hoạt động cùng bố/mẹ.',
  '1-7': 'Đứng dậy và nhảy theo bài hát! Làm "Jump Up High" và "Jump Around" cùng gia đình.',
  '1-10': 'Luyện "How are you?" Trả lời: "I\'m happy!" hoặc "I\'m tired!" Dùng mỗi ngày nhé.',
  '1-12': 'Hát bài Octopus và làm hoạt động Octopus cùng bố/mẹ.',
  '1-22': 'Hôm nay ôn tập! Tô màu cá và nói lại những từ đã học trong tháng.',
  '2-1': 'Học động vật dưới nước: fish, octopus, crab. Nói tên khi thấy hình.',
  '2-7': 'Hôm nay học động vật nông trại! Làm hoạt động. Nói "cow," "pig," "chicken."',
  '2-12': 'Chơi game động vật với gia đình. Gọi tên động vật bằng tiếng Anh nhé!',
  '3-1': 'Học "My House." Đi quanh nhà và nói tên các phòng bằng tiếng Anh.',
  '3-8': 'Ôn tất cả các phòng. Nói: living room, kitchen, bathroom, bedroom!'
};

function getParentGuide(monthId, dayInMonth) {
  return PARENT_GUIDES[monthId + '-' + dayInMonth] || PARENT_GUIDES.default;
}

function getKidGuide(monthId, dayInMonth) {
  return KID_GUIDES[monthId + '-' + dayInMonth] || KID_GUIDES.default;
}
