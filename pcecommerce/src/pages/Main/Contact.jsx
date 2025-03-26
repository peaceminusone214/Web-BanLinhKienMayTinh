import "./MainStyles/styleContact.css";
import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const data = { name, email, title, message };
    await postData(data);

    // Hiển thị thông báo alert
    window.alert("✅ Gửi thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.");

    // Xóa nội dung input sau khi gửi
    setName("");
    setEmail("");
    setTitle("");
    setMessage("");
  };

  return (
    <div className="form-container">
      <h1>
        Nếu bạn có thắc mắc hay yêu cầu gì, hãy gửi tin nhắn ngay cho chúng tôi!
      </h1>
      <form onSubmit={submit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề (Thắc mắc/Yêu cầu)"
        />
        <textarea
          className="text-area"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tin nhắn"
          rows="4"
        ></textarea>
        <button type="submit">Gửi ngay</button>
      </form>
    </div>
  );
}

export default Contact;

async function postData(data) {
  const formData = new FormData();
  formData.append("entry.1980956205", data.name);
  formData.append("entry.1652745850", data.email);
  formData.append("entry.290757960", data.title);
  formData.append("entry.1892934879", data.message);

  await fetch(
    "https://docs.google.com/forms/d/e/1FAIpQLSd6ViSkCbss-CsTwKHYMgxJlLSjSkjJWNaBXouz9H_ibPHFGg/formResponse",
    {
      method: "POST",
      body: formData,
      mode: "no-cors",
    }
  );
}
