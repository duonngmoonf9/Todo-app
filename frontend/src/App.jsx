import { BrowserRouter, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
// import HomePages from './pages/HomePages-vbeta';
import HomePages from './pages/HomePages';
import NotFound from './pages/NotFound';

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePages />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
            <Toaster richColors />
            {/* <button onClick={() => toast("hehehe")}>click</button> */}
        </>
    )
}

export default App
