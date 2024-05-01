import Game from "./components/noughts-and-crosses/Game";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div>
          <h1 className={"text-center"}>Noughts and Crosses</h1>
        </div>

        <Game />

        <div>
          <h2>Rules</h2>
          <ol>
            <li>Players are randomly assigned to play as either Noughts or Crosses &mdash; Crosses go first.</li>
            <li>Players take it in turns to draw their shape (X or O) in a box of their choosing.</li>
            <li>The first player to draw a line of 3 with their shape wins. If the grid is filled with neither player drawing a line of 3 the game ends in a draw.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
