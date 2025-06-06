function ApiError() {
  return (
    <section
      className="api-error"
      aria-live="assertive"
      role="alert"
      data-testid="api-error"
    >
      <div className="api-error__container">
        <h2 className="api-error__title">
          Sorry, something went wrong during the request.
        </h2>
        <p className="api-error__text">Please try again later.</p>
      </div>
    </section>
  );
}
export default ApiError;
