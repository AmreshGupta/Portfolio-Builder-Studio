export default function ImageUploadField({
  id,
  label,
  previewAlt,
  value,
  onChange,
  onRemove
}) {
  return (
    <div className="image-upload-field">
      <label className="form-label" htmlFor={id}>{label}</label>

      <div className="image-upload-box">
        {value ? (
          <img src={value} alt={previewAlt} className="image-upload-preview" />
        ) : (
          <div className="image-upload-placeholder">
            <span>Choose image</span>
            <small>PNG, JPG, JPEG or WEBP</small>
          </div>
        )}

        <div className="image-upload-actions">
          <label className="btn-secondary image-upload-button" htmlFor={id}>
            Upload
          </label>
          {value && (
            <button type="button" className="btn-secondary" onClick={onRemove}>
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="image-upload-input"
        onChange={onChange}
      />
    </div>
  );
}
