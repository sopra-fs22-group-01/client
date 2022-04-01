import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <div>
      {/*<Header height="100"/>   uncomment this line to make header appear again*/}
      <AppRouter/>
    </div>
  );
};

export default App;
