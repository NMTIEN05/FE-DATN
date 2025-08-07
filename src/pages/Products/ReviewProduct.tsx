import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StarFilled } from '@ant-design/icons';
import './ReviewProduct.css';

const API_BASE = 'http://localhost:8888/api/comments/comments';

const ReviewProduct = ({ productId }: { productId: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/${productId}`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ Lỗi khi lấy dữ liệu comments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  const handleAddComment = async () => {
    if (!newComment || rating === null) return;

    try {
      const res = await axios.post(
        `${API_BASE}/${productId}`,
        { content: newComment, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment('');
      setRating(null);
    } catch (err) {
      console.error('❌ Lỗi khi thêm bình luận:', err);
    }
  };

  return (
    <div className="review-container">
      <h2 className="review-title">Bình luận sản phẩm</h2>

      {isLoading ? (
        <p className="loading-text">Đang tải bình luận...</p>
      ) : (
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment-item">
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
            <p>Chưa có bình luận nào.</p>
          )}
        </div>
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
        <h3>Viết bình luận</h3>
        <textarea
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Thêm bình luận..."
        />
       
        <button className="submit-btn" onClick={handleAddComment}>
          Gửi bình luận
        </button>
      </div>
    </div>
  );
};

export default ReviewProduct;
