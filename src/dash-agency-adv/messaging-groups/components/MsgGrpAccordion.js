import React from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';
import { Collapse } from 'react-bootstrap';

const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccordionBlock = styled.div`
  position: relative;
`;

const Accordion = styled.div`
  font-size: 18px;
  font-weight: 600;
  background-color: #243643;
  color: #444;
  cursor: pointer;
  padding: 18px;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  transition: background-color 0.6s ease;
`;

const AccordionTitle = styled.div`
  color: white;
  font-size: 18px;
`;

const AccordionText = styled.div`
  font-weight: 600;
  font-size: 14px;
  padding: 18px;
`;

const AccordionIcon = styled.span`
  .msg-group-icon {
    color: white;
  }
`;
const AccordionContent = styled.div`
  border: 1px solid #ddd;
`;

const MsgGrpAccordion = (props) => {
  const { title, content, index, isActive, onClickAccordion } = props;

  const toggleAccordion = (indexs) => {
    onClickAccordion(indexs);
  };

  return (
    <AccordionSection>
      <Accordion className={`${isActive ? 'active' : ''}`} onClick={() => toggleAccordion(index)}>
        <AccordionTitle>{title}</AccordionTitle>
        <AccordionIcon className={`ml-auto-imp ${isActive ? 'rotate-90' : ''}`}>
          <i className="fas fa-chevron-right msg-group-icon"></i>
        </AccordionIcon>
      </Accordion>
      <AccordionContent>
        <Collapse in={isActive ? true : false}>
          <AccordionBlock>
            <AccordionText>{content}</AccordionText>
          </AccordionBlock>
        </Collapse>
      </AccordionContent>
    </AccordionSection>
  );
};

MsgGrpAccordion.propTypes = {
  title: PropTypes.any,
  content: PropTypes.any,
  index: PropTypes.number,
  onClickAccordion: PropTypes.func,
  isActive: PropTypes.bool,
};

export default MsgGrpAccordion;
