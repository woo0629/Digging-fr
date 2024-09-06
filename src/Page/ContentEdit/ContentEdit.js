import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/footer";
import Toolbar from "../../components/toolbar/toolbar";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import "./ContentEdit.css";
import apiUrl from "../../config";

function ContentEdit(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const contentData = location.state?.contentData || {};

  // 기존 이미지도 초기값으로 설정
  const [writeData, setWriteData] = useState({
    title: contentData.title || "",
    content: contentData.content || "",
    price: contentData.price || "",
    _id: contentData._id || "",
    image: contentData.image || "", // 기존 이미지 URL을 설정
  });

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwt_decode(token);
      setUserInfo(decoded);
    }
  }, []);

  // 파일 선택 시 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setWriteData((prevWriteData) => ({
      ...prevWriteData,
      image: file, // 새로운 이미지 파일로 교체
    }));
  };

  // 폼 제출 시 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!writeData.title || !writeData.content) {
      alert("제목과 내용을 모두 작성해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", writeData.title);
      formData.append("content", writeData.content);
      formData.append("price", writeData.price);
      formData.append("_id", writeData._id);
      formData.append("id", userInfo.id);
      formData.append("username", userInfo.username);

      // 이미지를 수정하지 않았을 경우 기존 이미지 URL 전송
      if (writeData.image && typeof writeData.image !== "string") {
        formData.append("image", writeData.image); // 새 이미지 업로드
      } else {
        formData.append("image", contentData.image || "");
      }
      console.log("contentData.image1", contentData.image);
      console.log("writeData.image1", writeData.image);

      const res = await fetch(`${apiUrl}/edit/${props.Category}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        console.log("서버 전송 완료");
        console.log("contentData.image2", contentData.image);
        console.log("writeData.image1", writeData.image);

        navigate(`/category/${props.Category}`);
      } else {
        console.log("서버 전송 실패");
      }
    } catch (e) {
      console.error("서버에 요청 중 오류가 발생했습니다.", e);
    }
  };

  return (
    <div>
      <Toolbar />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="input_container">
          <input
            type="text"
            placeholder="제목을 입력해주세요"
            value={writeData.title}
            onChange={(e) =>
              setWriteData((prevWriteData) => ({
                ...prevWriteData,
                title: e.target.value,
              }))
            }
          />
        </div>
        <div className="input_container">
          <input
            type="text"
            placeholder="내용을 입력해주세요"
            value={writeData.content}
            onChange={(e) =>
              setWriteData((prevWriteData) => ({
                ...prevWriteData,
                content: e.target.value,
              }))
            }
          />
        </div>
        <div className="input_container">
          <input
            type="text"
            placeholder="가격을 입력해주세요"
            value={writeData.price}
            onChange={(e) =>
              setWriteData((prevWriteData) => ({
                ...prevWriteData,
                price: e.target.value,
              }))
            }
          />
        </div>

        {/* 기존 이미지가 있으면 표시 */}
        {typeof writeData.image === "string" && (
          <div className="existing_image_container">
            <img
              src={writeData.image}
              alt="기존 이미지"
              style={{ width: "200px", margin: "10px auto" }}
            />
          </div>
        )}

        <div className="input_container">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">작성하기</button>
      </form>
      <Footer />
    </div>
  );
}

export default ContentEdit;
