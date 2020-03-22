export interface TimeBlockProps {
  startTime: string;
  endTime: string;
  blockInfo: TimeBlockInfo;
}

export interface TimeBlockInfo {
  courseCode: string;
  sectionType: string;
  sectionNum: string;
}

export default function TimeBlock(props: TimeBlockProps): JSX.Element;
