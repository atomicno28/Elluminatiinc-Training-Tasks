// OUTPUT

// N -> 4

// *
// #*
// *#*
// #*#*

#include<iostream>
using namespace std;
int main()
{
    int n; cin>>n;
    bool flag = 0;
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=i;j++)
        {
            if(flag)
            {
                if(j&1) cout << "#";
                else cout << "*";
            }
            else
            {
                if(j&1) cout << "*";
                else cout <<"#";
            }
        }
        flag = !flag;
        cout << endl;
    }
}