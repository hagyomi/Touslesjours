export const boardCategories={NOTICE:'공지',STYLE:'베이커리 이야기',REVIEW:'후기','Q&A':'질문'};
export const inquiryCategories={PRODUCT:'상품 문의',DELIVERY:'배송 문의',RETURN:'교환·반품',ACCOUNT:'회원정보',ETC:'기타'};
export const statusNames={PENDING:'접수 완료',IN_REVIEW:'확인 중',ANSWERED:'답변 완료'};
export function validateEntry(data,inquiry=false){const errors={};if(!(data.category in (inquiry?inquiryCategories:boardCategories)))errors.category='카테고리를 선택해 주세요.';const title=data.title?.trim()||'';const content=data.content?.trim()||'';if(title.length<2||title.length>100)errors.title='제목은 2~100자로 입력해 주세요.';if(content.length<10||(inquiry&&content.length>2000))errors.content=inquiry?'내용은 10~2,000자로 입력해 주세요.':'내용은 10자 이상 입력해 주세요.';if(inquiry&&data.orderNumber&&!/^[A-Za-z0-9-]{5,40}$/.test(data.orderNumber))errors.orderNumber='주문번호는 영문·숫자·하이픈 5~40자로 입력해 주세요.';return errors;}

