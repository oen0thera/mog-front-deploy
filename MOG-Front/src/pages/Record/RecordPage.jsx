// 📄 RecordPage.jsx
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./record.css"; // CSS 경로

export default function RecordPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("운동");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const toggleUpload = () => setShowUpload((prev) => !prev);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="record-container">
      <header className="record-header">기록</header>

      {/* 탭 선택 */}
      <div className="record-tabs">
        {["운동", "포토", "신체"].map((tab) => (
          <button
            key={tab}
            className={`record-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setShowUpload(false);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 운동 탭 */}
      {activeTab === "운동" && (
        <>
          <div className="calendar-wrapper">
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              onClickDay={handleDateClick}
              calendarType="gregory"
              locale="ko-KR"
              formatDay={(locale, date) => date.getDate()}
              showNeighboringMonth={false}
            />
          </div>

          <div className="record-labels">
            <span className="dot-label"><span className="dot red"></span> 운동 기록</span>
            <span className="dot-label"><span className="dot green"></span> 사진 기록</span>
            <span className="dot-label"><span className="dot blue"></span> 신체 기록</span>
          </div>
        </>
      )}

      {/* 포토 탭 */}
      {activeTab === "포토" && (
        <div className="photo-tab">
          <div className="photo-header">
            <span>포토 기록</span>
            <button className="photo-add-btn" onClick={toggleUpload}>+</button>
          </div>

          {showUpload && (
            <div className="upload-form">
              <button className="back-btn" onClick={toggleUpload}>←</button>
              <p>📷 업로드할 사진/비디오 추가</p>
              <p>기록 날짜: {selectedDate.toLocaleDateString()}</p>
              <p>공개 설정: <span style={{ color: "red" }}>비공개</span></p>
              <textarea placeholder="내용을 입력하세요" />

              <div className="button-group">
                <label htmlFor="fileInput" className="upload-label">첨부하기</label>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button className="submit-btn">업로드</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 신체 탭 */}
      {activeTab === "신체" && (
        <div className="record-placeholder">
          📊 신체 기록이 들어가는 자리입니다.
        </div>
      )}

      {/* 날짜 클릭시 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedDate.toLocaleDateString()} 기록</h3>
            <p>여기에 운동/포토/신체 기록 정보가 표시될 예정입니다.</p>
            <button onClick={closeModal} className="modal-close">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
