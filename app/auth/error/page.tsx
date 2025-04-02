export default function AuthErrorPage({ searchParams }: { searchParams: { message: string } }) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-effect p-6 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500">Verification Failed</h1>
          <p className="text-white mt-4">{searchParams.message || 'An unknown error occurred.'}</p>
        </div>
      </div>
    );
  }
  