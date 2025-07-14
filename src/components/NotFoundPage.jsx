export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 px-4 text-center">
      <img
        src="/404-illustration.svg"
        alt="Página no encontrada"
        className="w-64 mb-8 mx-auto"
      />
      <h1 className="text-7xl font-extrabold text-indigo-600 mb-4 drop-shadow-md">
        404
      </h1>
      <p className="text-2xl font-semibold text-gray-700 mb-3">
        ¡Oops! No encontramos la página que buscas.
      </p>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Puede que el enlace esté roto o la página haya sido movida o eliminada. 
        Intenta regresar al inicio o verifica la URL.
      </p>
      <a
        href="/"
        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition shadow-lg"
      >
        Volver al inicio
      </a>
    </div>
  );
}
