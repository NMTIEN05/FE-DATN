import React, { useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { StarFilled } from "@ant-design/icons";
import { toast } from "react-toastify";
import "./ReviewProduct.css";

const BASES = [
  "http://localhost:8888/api/comments",          
  "http://localhost:8888/api/comments/comments",
] as const;

async function axiosGetWithFallback<T>(path: string): Promise<T> {
  let lastErr: any;
  for (const b of BASES) {
    try {
      const res = await axios.get<T>(`${b}${path}`);
      return res.data as T;
    } catch (e: any) {
      lastErr = e;
      if (e?.response?.status !== 404) throw e;
    }
  }
  throw lastErr;
}
async function axiosPostWithFallback<T>(path: string, body: any, headers?: any): Promise<T> {
  let lastErr: any;
  for (const b of BASES) {
    try {
      const res = await axios.post<T>(`${b}${path}`, body, headers);
      return res.data as T;
    } catch (e: any) {
      lastErr = e;
      if (e?.response?.status !== 404) throw e;
    }
  }
  throw lastErr;
}

interface ReviewProductProps {
  productId: string;
  hideOldComments?: boolean;
}

interface UserInfo {
  username?: string;
}

interface ProductComment {
  _id?: string;
  user?: UserInfo;
  content: string;
  rating: number; 
  createdAt?: string;
  __tempId?: string;
}

type Distribution = Record<1 | 2 | 3 | 4 | 5, number>;

const Stars: React.FC<{ value: number; size?: "sm" | "md" | "lg" }> = ({ value, size = "md" }) => (
  <span className={`comment-stars size-${size}`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <StarFilled key={s} className={s <= Math.round(value) ? "star filled" : "star"} />
    ))}
  </span>
);

function getAuthHeaders(): Record<string, string> | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = localStorage.getItem("token");
  if (!raw) return undefined;
  const hasPrefix = raw.toLowerCase().startsWith("bearer ");
  return { Authorization: hasPrefix ? raw : `Bearer ${raw}` };
}

const ReviewProduct: React.FC<ReviewProductProps> = ({ productId, hideOldComments = false }) => {
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const [filterStar, setFilterStar] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const pendingTempId = useRef<string | null>(null);

  const fetchList = async () => {
    setIsLoadingList(true);
    try {
      const arr = await axiosGetWithFallback<ProductComment[]>(`/${productId}`);
      setComments(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách đánh giá:", err);
      setComments([]);
    } finally {
      setIsLoadingList(false);
    }
  };
  useEffect(() => {
    fetchList();
  }, [productId]);

  const summary = useMemo(() => {
    const list = comments.filter((c) => Number(c.rating) >= 1 && Number(c.rating) <= 5);
    const count = list.length;
    const average =
      count === 0 ? 0 : list.reduce((a, c) => a + (Number(c.rating) || 0), 0) / count;
    return { count, average };
  }, [comments]);

  const distribution: Distribution = useMemo(() => {
    const d: Distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const c of comments) {
      const r = Math.round(Number(c.rating) || 0);
      if (r >= 1 && r <= 5) d[r as 1 | 2 | 3 | 4 | 5] += 1;
    }
    return d;
  }, [comments]);

  const total = summary.count || 0;
  const percent = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const summaryLabel = useMemo(
    () => `${(summary.average || 0).toFixed(1)}/5 từ ${total} đánh giá`,
    [summary, total]
  );

  const filteredComments = useMemo(() => {
    if (filterStar === 0) return comments;
    return comments.filter((c) => Math.round(Number(c.rating) || 0) === filterStar);
  }, [comments, filterStar]);

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!rating || rating < 1 || rating > 5) {
      toast.warning("Vui lòng chọn số sao (1-5)!");
      return;
    }
    if (content.length < 6) {
      toast.warning("Nội dung đánh giá tối thiểu 6 ký tự nhé!");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);

    const tempId = `temp-${Date.now()}`;
    pendingTempId.current = tempId;

    const optimistic: ProductComment = {
      __tempId: tempId,
      user: { username: "Bạn" },
      content,
      rating,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [optimistic, ...prev]);

    try {
      const headers = getAuthHeaders();
      const saved = await axiosPostWithFallback<ProductComment>(
        `/${productId}`,
        { content, rating },
        headers ? { headers } : undefined
      );

      // Replace temp
      setComments((curr) => {
        const idx = curr.findIndex((c) => c.__tempId === tempId);
        if (idx !== -1) {
          const next = [...curr];
          next[idx] = { ...saved, createdAt: saved.createdAt || new Date().toISOString() };
          return next;
        }
        return [{ ...saved }, ...curr];
      });

      toast.success("Đánh giá thành công!");
      setNewComment("");
      setRating(null);
      setFilterStar(0);
    } catch (err) {
      setComments((curr) => curr.filter((c) => c.__tempId !== tempId));

      const e = err as AxiosError<any>;
      if (e.response?.status === 401) {
        toast.error("Bạn cần đăng nhập để đánh giá.");
      } else if (e.response?.data?.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("❌ Gửi đánh giá thất bại. Thử lại nhé!");
      }
      console.error(err);
    } finally {
      pendingTempId.current = null;
      setIsSubmitting(false);
    }
  };

  const titleText = hideOldComments ? "Đánh giá sản phẩm" : "Bình luận sản phẩm";
  const starClass = (s: number) =>
    (hoverRating ?? rating ?? 0) >= s ? "star filled selectable" : "star selectable";

  return (
    <div className="review-container">
      <div className="rp-summary">
        <div className="rp-score">
          <div className="rp-score-value">{(summary.average || 0).toFixed(1)}</div>
          <Stars value={summary.average || 0} size="lg" />
          <div className="rp-score-count">{summaryLabel}</div>
        </div>

        <div className="rp-breakdown">
          {[5, 4, 3, 2, 1].map((s) => (
            <div className="rp-row" key={s}>
              <span className="rp-row-label">{s} sao</span>
              <div className="rp-progress">
                <div className="rp-progress-bar" style={{ width: `${percent(distribution[s as 1 | 2 | 3 | 4 | 5])}%` }} />
              </div>
              <span className="rp-row-num">{distribution[s as 1 | 2 | 3 | 4 | 5]}</span>
            </div>
          ))}
        </div>

        <div className="rp-actions">
          <div className="rp-chips">
            {[0, 5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                className={`rp-chip ${filterStar === s ? "active" : ""}`}
                onClick={() => setFilterStar(s as 0 | 1 | 2 | 3 | 4 | 5)}
                disabled={isLoadingList}
              >
                {s === 0 ? "Tất cả" : `${s} sao`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h2 className="review-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {titleText} ({summary.count})
        <span className="muted">{summaryLabel}</span>
      </h2>

      {!hideOldComments && (
        <>
          {isLoadingList ? (
            <p className="loading-text">Đang tải ...</p>
          ) : (
            <div className="comments-list">
              {filteredComments.length > 0 ? (
                filteredComments.map((comment, idx) => (
                  <div key={comment._id || comment.__tempId || idx} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-info">
                        <div className="avatar">{(comment.user?.username || "U")[0]}</div>
                        <div>
                          <p className="comment-username">{comment.user?.username || "Người dùng"}</p>
                          <Stars value={comment.rating || 0} />
                        </div>
                      </div>
                      {comment.createdAt && (
                        <span className="comment-time">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p>Chưa có đánh giá nào.</p>
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
            className={starClass(s)}
            onMouseEnter={() => setHoverRating(s)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => setRating(s)}
          />
        ))}
      </div>

      <div className="add-comment">
        <textarea
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
          maxLength={2000}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <small className="muted">{newComment.trim().length}/2000</small>
          <button className="submit-btn" onClick={handleAddComment} disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewProduct;
