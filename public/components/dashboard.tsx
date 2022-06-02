/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import './layers.scss';
import { VisGraphComponent } from './vis_graph_component';
import { EuiPage, EuiPanel, EuiResizableContainer } from '@elastic/eui';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { PanelComponent } from './menu/panel';
import { VisNode, VisEdge } from './app';

type Props = {
  nodes: VisNode[];
  edges: VisEdge[];
};

export function DashboardComponent({nodes, edges}: Props) {
  const navigate = useNavigate();
  const handleRouting = (route: string) => {
   navigate(route);
  }
    return (
        <EuiPage paddingSize="none">
          <EuiResizableContainer  style={{ height: 650, width:"100%" }}>
            {(EuiResizablePanel, EuiResizableButton) => (
             <>
              <EuiResizablePanel mode="collapsible" initialSize={20} minSize="10%">
                <PanelComponent/>    
              </EuiResizablePanel>

              <EuiResizableButton />

              <EuiResizablePanel mode="main" initialSize={80} minSize="500px">
                  <Routes>
                    <Route path='/' element={<VisGraphComponent nodes={nodes} edges={edges} color={'#5B4897'}/>}/> 
                    <Route path='/layer2' element={<VisGraphComponent nodes={nodes} edges={edges} color={'#F39000'}/>}/> 
                  </Routes>
                   
                    <div className='layer-container'>
                      <EuiPanel className='layer-panel' paddingSize="s">
                        <p><b>Layers</b></p>
                        <br></br>
                        <div className='layer-stack'>
                          <div className="layer-1" onClick={() => handleRouting('/')}></div>
                          <div className="layer-2" onClick={() => handleRouting('/layer2')}></div>
                        </div>
                      </EuiPanel>
                    </div>
                   
              </EuiResizablePanel>
            </>
          )}
        </EuiResizableContainer>
      </EuiPage> 
    );  
}
