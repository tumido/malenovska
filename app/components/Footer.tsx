export const Footer = () => {
  return (
    <footer className="flex flex-col items-center gap-1 bg-black/80 py-12 text-grey-400 text-sm">
      <p>
        Zlišky{" "}
        <span role="img" aria-label="heart">
          ❤️
        </span>{" "}
        Malenovská
      </p>
      <p>Pod záštitou spolku Strážci Mezihoří, z.s.</p>
      <p>Konání akce umožnil podnik Lesy České Republiky, s. p.</p>
      <p>
        <a href="https://reactjs.org/" target="_blank" rel="external" className="hover:underline">
          React
        </a>
        ,{" "}
        <a
          href="https://firebase.google.com/docs/firestore/"
          target="_blank"
          rel="external"
          className="hover:underline"
        >
          Google Cloud Firestore
        </a>
      </p>
    </footer>
  );
};
