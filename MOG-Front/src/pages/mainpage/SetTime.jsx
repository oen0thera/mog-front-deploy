import { useState, useEffect, useRef } from 'react';
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import { URL } from '../../config/constants';
import axios from 'axios';
import { Button, Card, ListGroup, Modal } from 'react-bootstrap';

function SetTime({
        initDetailTime,
        routineId,
        currentDetailId, 
        isCurrentTimeRunning,
        setSubDetailTime,
        subDetailTime,
        reset,
        setDetailTime,
        setIsCurrentRunning,
        startRrcodResultData,
    }) {

    const [initDetail,setDetail] = useState();
    const [checkRouData,setCheckRouData] = useState([]);
    const [show, setShow] = useState(false);
    const [stopAndStartTime,setStopAndStartTime] =useState(true);
    const loadRoutineDetail=async ()=>{
        await axios.get(`${URL.ROUTINEDETAIL}/${routineId}`)
            .then(res=> {setDetail(res.data.state);return res.data})
            .then(prev=>setCheckRouData(prev))
    }
    const fixKgAndManyNum=(detailTimes)=>{
        const fixDeatilData =  initDetail.map(item=>{
            if(item.id===String(currentDetailId)){
                return {
                    ...item,
                    lest:String(detailTimes)
                }
            }
            return item;
        });
        axios.put(`${URL.ROUTINEDETAIL}/${routineId}`,{
            id:checkRouData.id,
            state:[...fixDeatilData]
        })
        .then(res=>{setDetail(res.data.state); return res.data.state})
    }

    
    const plus=()=>{
        //setTime(res=>res+10);
        /*
        if(subDetailTime <=290){
            setSubDetailTime(res=>{
                const subDetailTime=String(parseInt(res)+10)
                fixKgAndManyNum(subDetailTime);
                return subDetailTime;
            })
        };
        */
       if(subDetailTime <=300) setSubDetailTime(String(parseInt(subDetailTime)+10));
    }
    const minus=()=>{
        //setTime(res=>res-10);
        /*
        if(subDetailTime >=10) {
            setSubDetailTime(res=>{
                const subDetailTime=res-10
                fixKgAndManyNum(subDetailTime);
                return subDetailTime;
            })
        };
        */
       if(subDetailTime >=20) setSubDetailTime(subDetailTime=subDetailTime-10);
    }

    useEffect(()=>{
        //detailData();
        loadRoutineDetail();
        setSubDetailTime(initDetailTime);
    },[initDetailTime])

    useEffect(()=>{
        if(startRrcodResultData)setStopAndStartTime(false);
        else setStopAndStartTime(true);
    },[startRrcodResultData])

    useEffect(() => {
        let timer;

        if (isCurrentTimeRunning && subDetailTime > 0) {
            timer = setTimeout(() => {
            setSubDetailTime(prev => prev - 1);
            }, 1000); // 1초마다 감소
        }
        if (subDetailTime<=0) reset();

        return () => clearTimeout(timer); // 컴포넌트 언마운트 또는 타임 변경 시 타이머 정리
    }, [isCurrentTimeRunning, subDetailTime]);
    
    const ITEM_HEIGHT = 50;
    const VISIBLE_COUNT = 3;
    const PADDING_HEIGHT = (ITEM_HEIGHT * VISIBLE_COUNT) / 2 - ITEM_HEIGHT / 2;

    const items = [
    '10','20','30','40','50','60','70','80','90','100',
    '110','120','130','140','150','160','170','180','190','200',
    '210','220','230','240','250','260','270','280','290','300'
    ];
    const containerRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollTimeout = useRef(null);

    const onScroll = () => {
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

        scrollTimeout.current = setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollMid = container.scrollTop + container.clientHeight / 2;

        let closestIndex = 0;
        let minDist = Infinity;

        items.forEach((_, idx) => {
            const itemMid = PADDING_HEIGHT + idx * ITEM_HEIGHT + ITEM_HEIGHT / 2;
            const dist = Math.abs(scrollMid - itemMid);
            if (dist < minDist) {
            minDist = dist;
            closestIndex = idx;
            }
        });

        setSelectedIndex(closestIndex);
        }, 10);
    };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const initialScrollTop = PADDING_HEIGHT + selectedIndex * ITEM_HEIGHT - container.clientHeight / 2 + ITEM_HEIGHT / 2;
      container.scrollTop = initialScrollTop;
    }
  }, []);

    return <>
        <div className={` ${styles.header} container`} style={{position:'fixed',top:'85px',zIndex:'100'}}>
            <a href='#' style={{textDecoration: "none"}} onClick={()=>setShow(true)}><h2>{subDetailTime}</h2></a>
            <Button className={` btn btn-primary`} type="button" onClick={e=>plus()}>+</Button>
            <Button className={` btn btn-primary`} type="button" onClick={e=>minus()}>-</Button>
            <div hidden={stopAndStartTime}>
            <Button variant={isCurrentTimeRunning ? 'danger' : 'primary'} onClick={() => isCurrentTimeRunning?setIsCurrentRunning(false):setIsCurrentRunning(true)}>
            {isCurrentTimeRunning ? '일시정지' : '시작'}
            </Button>
            <Button variant="secondary" onClick={() => reset()}>
                초기화
            </Button>
            </div>
            
        </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header>
          <Modal.Title>휴식 타임</Modal.Title>
        </Modal.Header>
        <Modal.Body >
         <Card style={{ width: 240, margin: '0px 40px 0px 50px', boxShadow: 'none', border: 'none'}}>
            <div
                ref={containerRef}
                onScroll={onScroll}
                style={{
                    height: ITEM_HEIGHT * VISIBLE_COUNT,
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    userSelect: 'none',
                    position: 'relative',
                    
                }}
            >
                <ListGroup variant="flush">
                {/* 상단 더미 */}
                <div style={{ height: PADDING_HEIGHT }} />
                {items.map((item, idx) => (
                    <ListGroup.Item
                    key={idx}
                    action
                    active={idx === selectedIndex}
                    style={{
                        height: ITEM_HEIGHT,
                        lineHeight: `${ITEM_HEIGHT}px`,
                        textAlign: 'center',
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontWeight: idx === selectedIndex ? '700' : '400',
                        fontSize: idx === selectedIndex ? '1.9rem' : '1rem',
                        color: idx === selectedIndex ? '#007bff' : '#333',
                        transition: 'background-color 0.3s',
                        backgroundColor: 'transparent',
                        border: 'none',
                        
                    }}
                    onClick={() => {
                        const container = containerRef.current;
                        if (!container) return;

                        const targetScrollTop = PADDING_HEIGHT + idx * ITEM_HEIGHT - container.clientHeight / 2 + ITEM_HEIGHT / 2;
                        container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
                        setSelectedIndex(idx);
                    }}
                    >
                    {item}초
                    </ListGroup.Item>
                ))}

                {/* 하단 더미 */}
                <div style={{ height: PADDING_HEIGHT }} />
                </ListGroup>
            </div>
            </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>취소</Button>
          <Button variant="primary" onClick={() => {setDetailTime(items[selectedIndex]);fixKgAndManyNum(items[selectedIndex]);setShow(false);}}>확인</Button>
        </Modal.Footer>
      </Modal>
    </>;
}

export default SetTime;