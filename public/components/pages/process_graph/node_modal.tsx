import {
  EuiButton,
  EuiButtonEmpty,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui';
import { VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';

export interface NodeModalProps {
  node: VisNode;
}
const mapStateToProps = (state: NodeModalProps) => {
  return state;
};

const NodeModal = (props: NodeModalProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  const node = props.node;

  function handleDrillDown(event: any) {}

  return (
    <EuiOverlayMask>
      <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle>Details for Node: {node.label}</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>Case Id: {node.caseID}</EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>

          <EuiButton onClick={handleDrillDown} fill>
            Drill Down
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators({}, dispatch);
};

const connectedNodeModal = connect(mapStateToProps, mapDispatchToProps)(NodeModal);
export { connectedNodeModal as NodeModal };
