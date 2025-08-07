import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StarFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';
import './ReviewProduct.css';

const API_BASE = 'http://localhost:8888/api/comments/comments';

interface ReviewProductProps {
  productId: string;
  hideOldComments?: boolean;
}

const ReviewProduct: React.FC<ReviewProductProps> = ({ productId, hideOldComments = false }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (hideOldComments) return; 

    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/${productId}`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ Lỗi khi lấy dữ liệu Đánh giá:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [productId, hideOldComments]);

  const handleAddComment = async () => {
    if (!newComment || rating === null) {
      toast.warning("Vui lòng nhập Đánh giá và chọn số sao!");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/${productId}`,
        { content: newComment, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!hideOldComments) {
        setComments([{ user: { username: "Bạn" }, content: newComment, rating }, ...comments]);
      }

      toast.success("Đánh giá thành công!");
      setNewComment('');
      setRating(null);
    } catch (err) {
      toast.error("❌ Lỗi khi thêm Đánh giá");
      console.error(err);
    }
  };

  return (
    <div className="review-container">
      <h2 className="review-title">
        {hideOldComments ? 'Đánh giá sản phẩm' : 'Bình luận sản phẩm'}
      </h2>

      {!hideOldComments && (
        <>
          {isLoading ? (
            <p className="loading-text">Đang tải ...</p>
          ) : (
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <div key={comment._id || idx} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-info">
                        <p className="comment-username">{comment.user?.username || 'Người dùng'}</p>
                        <div className="comment-stars">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarFilled
                              key={s}
                              className={s <= comment.rating ? 'star filled' : 'star'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p>Chưa có Đánh giá nào.</p>
              )}
            </div>
          )}
        </>
      )}

      <div className="comment-rating-stars">
        <label>Đánh giá:</label>
        {[1, 2, 3, 4, 5].map((s) => (
          <StarFilled
            key={s}
            className={
              (hoverRating || rating) >= s ? 'star filled selectable' : 'star selectable'
            }
            onMouseEnter={() => setHoverRating(s)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => setRating(s)}
          />
        ))}
      </div>

      <div className="add-comment">
        <h3>Đánh Giá</h3>
        <textarea
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Thêm bình luận..."
        />

        <button className="submit-btn" onClick={handleAddComment}>
          Gửi 
        </button>
      </div>
    </div>
  );
};

export default ReviewProduct;
