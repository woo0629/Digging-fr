import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Toolbar from "../../components/toolbar/toolbar";
import Footer from "../../components/footer/footer";
import apiUrl from "../../config";
import "./board_edit.css";

const BoardEdit = () => {
  const { postId } = useParams();
  const [postDetail, setPostDetail] = useState({
    title: "",
    content: "",
    tag: null,
  });
  const animatedComponents = makeAnimated();
  const navigate = useNavigate();

  // 태그 옵션
  const tagOptions = [
    { value: "공지사항", label: "공지사항" },
    { value: "소통해요", label: "소통해요" },
    { value: "찾아줘요", label: "찾아줘요" },
  ];

  // 태그 변경 핸들러
  const handleTagChange = (selectedOption) => {
    setPostDetail((prevData) => ({
      ...prevData,
      tag: selectedOption, // 선택된 태그 객체 전체를 저장
    }));
  };

  // 게시글 세부 정보 불러오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await fetch(`${apiUrl}/board_detail/${postId}`);
        if (response.ok) {
          const data = await response.json();

          // 받아온 tag를 tagOptions에서 매칭되는 객체로 찾음
          const matchedTag = tagOptions.find(
            (tag) => tag.value === data.post.tag
          );

          setPostDetail({
            title: data.post.title,
            content: data.post.content,
            tag: matchedTag, // 매칭된 태그 객체를 설정
          });
        } else {
          const errorMessage = await response.text();
          console.error(
            `게시글 데이터를 불러오지 못했습니다. Status: ${response.status}, Message: ${errorMessage}`
          );
        }
      } catch (error) {
        console.error("Error fetching post detail:", error.message);
      }
    };

    fetchPostDetail();
  }, [postId]);

  // 폼 제출 핸들러
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/board_edit/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: postDetail.title,
          content: postDetail.content,
          tag: postDetail.tag?.value, // 태그의 value를 전송
        }),
      });

      if (response.ok) {
        // 수정이 성공하면 상세 페이지로 이동
        navigate(`/board_detail/${postId}`);
      } else {
        const errorMessage = await response.text();
        console.error(
          `수정 실패. Status: ${response.status}, Message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("Error editing post:", error.message);
    }
  };

  return (
    <div>
      <Toolbar />
      <div className="boardEdit-container">
        <form onSubmit={handleFormSubmit}>
          <label>
            태그
            <Select
              className="writer-select"
              components={animatedComponents}
              isMulti={false}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: "primary25",
                  primary: "black",
                },
              })}
              options={tagOptions}
              value={postDetail.tag} // 현재 선택된 태그 객체
              onChange={handleTagChange}
              placeholder="태그를 선택하세요"
            />
          </label>

          <div className="boardEdit-titleInput-box">
            <label>
              제목
              <input
                className="boardEdit-titleInput"
                type="text"
                placeholder="제목을 입력해주세요"
                value={postDetail.title}
                onChange={(e) =>
                  setPostDetail({
                    ...postDetail,
                    title: e.target.value,
                  })
                }
              />
            </label>
          </div>

          <label>
            내용
            <textarea
              className="boardEdit-titleContent"
              placeholder="내용을 입력해주세요"
              value={postDetail.content}
              onChange={(e) =>
                setPostDetail({
                  ...postDetail,
                  content: e.target.value,
                })
              }
            />
          </label>
          <br />
          <div className="boardEdit-submitButton-box">
            <button className="boardEdit-submitButton" type="submit">
              수정 완료
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default BoardEdit;
