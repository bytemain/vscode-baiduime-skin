interface DocumentLine {
  text: string;
  line: number;
}

const textToFileLines = (text: string): DocumentLine[] => {
  return text.split(/\n/).map((text, index) =>
    Object({
      text: text,
      line: index
    })
  );
};

export { textToFileLines, DocumentLine };
